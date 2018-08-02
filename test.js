
let url = "http://localhost:4096/api/transactions"

const axios = require('axios')


let chain =     {
  name: 'test2',
  link: 'https://github.com/testchain2.zip',
  desc: 'test chain',
  icon: 'https://github.com/testchain.png',
  delegates: [
    "flame bottom dragon rely endorse garage supply urge turtle team demand put",
    "thrive veteran child enforce puzzle buzz valley crew genuine basket start top",
    "black tool gift useless bring nothing huge vendor asset mix chimney weird",
    "ribbon crumble loud chief turn maid neglect move day churn share fabric",
    "scan prevent agent close human pair aerobic sad forest wave toe dust"
  ],
  unlockDelegates: 3,
}

const trs = {
  secret: "sentence weasel match weather apple onion release keen lens deal fruit matrix",
  fee: 100*1e8,
  type: 200,
  args: [
    chain.name,
    chain.desc,
    chain.link,
    chain.icon,
    chain.delegates,
    chain.unlockDelegates,
  ],
  senderId: "AHMCKebuL2nRYDgszf9J2KjVZzAw95WUyB"
}

axios.put(url, trs)
  .then((response) => {
    console.log(`${JSON.stringify(response.data, null, 2)}`)
  })
  .catch(erro => {
    console.log(erro.message)
  })




//result: a9c242fe7ff77cffd1d650c5eabcb0f7b42e0bd3b53e9a0abc75c869f0529419
