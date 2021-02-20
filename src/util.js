import {REQUIRED} from './parser.js'

export function resolve_in_order(proms) {
    let rets = []
    let pp = Promise.resolve()
    proms.forEach((p,i) => {
        pp = pp.then(p).then(ret => {
            rets.push(ret)
            return ret
        })
    })
    return pp.then(()=>rets)
}

async function mkdir(dir) {
    return new Promise((res,rej)=>{
        real_mkdir(dir,(err)=>{
            if(err) {
                // console.log(err)//return rej(err)
            }
            res()
        })
    })
}

export function match_args_to_params(args,old_params,name) {
    return Object.entries(old_params).map(([key, value]) => {
        let n1 = args.findIndex(a => a.type === 'named' && a.name === key)
        if (n1 >= 0) {
            let arg = args[n1]
            args.splice(n1, 1)
            return arg.value
        } else {
            //grab the first indexed parameter we can find
            let n = args.findIndex(a => a.type === 'indexed')
            if (n >= 0) {
                let arg = args[n]
                args.splice(n, 1)
                return arg.value
            } else {
                if (value === REQUIRED) throw new Error(`parameter ${key} is required in function ${name}`)
                return value
            }
        }
    })
}
