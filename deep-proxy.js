const SYM_IS_WRAPPED = Symbol.for("IS_WRAPPED");
SYM_IS_WRAPPED.SYM_IS_WRAPPED = true;
const SYM_DELTA = Symbol.for("SYM_DELTA");
SYM_DELTA.SYM_IS_WRAPPED = true;
const SYM_DEEP_PROXY_PARENT = Symbol.for("SYM_DEEP_PROXY_PARENT");

const innerHandler = (parent, mutationHandler = (obj, props)=>{
  console.log(`Mutation: ${obj} ${props}`);
}) => ({
  set(obj, prop, value) {
    mutationHandler(obj, prop, value);

    obj[SYM_DELTA] = {
      prop: prop
    };
    obj[prop] = value; // wrap? Hopefully this triggers proxy set
  },
  get(obj, prop) {
    return wrap(obj, prop);        
  },
  getPrototypeOf(target) {
    console.log("TEST");
    return Proxy;
  }
});

function wrap(obj, prop, mutationHandler) {
  
  if (!prop) {
    return obj[prop];
  }

  if (!obj[prop]) {
    return obj[prop];
  }

  // Symbols like SYM_IS_WRAPPED aren't objects, so
  // don't have to worry about infinite recursive gets
  // wrapping Symbols with Proxies
  if (typeof obj[prop] !== "object") {
    return obj[prop];
  }

  // Mechanism to not overwrap wrapped objects
  if (obj[prop][SYM_IS_WRAPPED] === true) {
    return obj[prop];
  }

  // Store owner
  obj[prop][SYM_DEEP_PROXY_PARENT] = obj;

  // Wrap
  obj[prop][SYM_IS_WRAPPED] = true;

  const ret = new Proxy(obj[prop], innerHandler(obj, mutationHandler));

  obj[prop] = ret;
  return ret;
}

let handler = {
  get(obj, prop) {

    if (typeof obj[prop] === "object") {
      return wrap(obj, prop);
    }

    return obj[prop];
  }
};


function proxyWrap(obj, mutationHandler) {
  return new Proxy(obj, innerHandler(obj, mutationHandler));
}

let test;

test = proxyWrap({
  text: "test",
  author: {
    name: "asdf"
  },
  deep1: {
    txt1: "1234",
    deep2: {
      txt2: "2345",
      deep3: {
        txt3: "asdf"
      }
    }
  }
});

module.exports = {
  proxyWrap
};

console.log(`${test.deep1}`)
console.log(`${test.deep1.deep2}`)
console.log(`${test.deep1.deep2.deep3}`)
console.log(`${test.deep1.deep2.deep3.txt3}`)
console.log(`${test.deep1.deep2.txt2}`)

test.deep1.deep2.deep3.txt3 = "wjoeifo";

console.log(`${test.deep1.txt1}`)

console.log(`${test.deep1.deep2[SYM_DEEP_PROXY_PARENT] === test.deep1}`)
