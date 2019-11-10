const SYM_IS_WRAPPED = Symbol.for("IS_WRAPPED");
SYM_IS_WRAPPED.SYM_IS_WRAPPED = true;
const SYM_DELTA = Symbol.for("SYM_DELTA");
SYM_DELTA.SYM_IS_WRAPPED = true;

const innerHandler = {
  set(obj, prop, value) {
    console.log(`LOG MUTATION `);

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
}

function wrap(obj, prop) {
  
  if (!prop) {
    return obj[prop];
  }

  if (!obj[prop]) {
    return obj[prop];
  }

  if (typeof obj[prop] !== "object") {
  //   try {
  //     console.log(`NOT OBJ: ${obj}[${prop}] = ${obj[prop]}`);
  //     console.log(typeof obj[prop]);  
  //   } catch(e) {
  //     console.log(`NOT OBJ: ${obj} SYMBOL`)
  //   }

    return obj[prop];
  }

  // SYM_IS_WRAPPED isn't an object, no recursion
  // if (prop === SYM_IS_WRAPPED) {
  //   return obj[SYM_IS_WRAPPED];
  // }

  if (obj[prop][SYM_IS_WRAPPED] === true) {
    // Hopefully this is the proxy in the prop
    // Supposed to return cached proxy that replaced this prop

    return obj[prop];
  }

  // Wrap
  obj[prop][SYM_IS_WRAPPED] = true;
  const ret = new Proxy(obj[prop], innerHandler);

  obj[prop] = ret;
  return ret;
}

let handler = {
  get(obj, prop) {

    if (typeof obj[prop] === "object") {
      // return wrapAttribute(obj, obj[prop]);

      return wrap(obj, prop);
    }

    return obj[prop];
  }
};


function proxyWrap(obj) {
  // return new Proxy(obj, handler);
  return new Proxy(obj, innerHandler);
}

let test;
// let test = proxyWrap({name: "check"});

// console.log(test.name);

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

// console.log(`AUTHOR ${test.author}`);
// console.log(`AUTHOR NAME ${test.author.name}`);
console.log(`${test.deep1}`)
console.log(`${test.deep1.deep2}`)
console.log(`${test.deep1.deep2.deep3}`)
console.log(`${test.deep1.deep2.deep3.txt3}`)
console.log(`${test.deep1.deep2.txt2}`)
console.log(`${test.deep1.txt1}`)

// console.log(`${test.deep1.deep2.deep3 instanceof Proxy}`)



// console.log(`${test.deep1}`)
// console.log(`${test.deep1.deep2}`)

// console.log(test.author.name);
// test.author.name = "ring";
// console.log(test.author.name);
