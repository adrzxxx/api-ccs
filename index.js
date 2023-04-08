const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const e = require('express')
const newspapers = [
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/environment/climate-change',
        base: '',
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base: '',

    },
    {
        name: ' telegraph',
        address: 'https://www.telegraph.co.uk/climate-change/',
        base: 'https://www.telegraph.co.uk',
    },
]
const app = express()
const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })

        })
})

app.get('/', (_req, res) => {
    res.json('welcome to my l')
})

app.get('/news', (req, res) => {
    res.json(articles)

    // axios.get('https://timesofindia.indiatimes.com/?from=mdr')
    // .then((response)=>{
    // const html = response.data
    // const $ = cheerio.load(html)
    // $('a:contains("fighter")',html).each(function() {
    //     const title = $(this).text()
    //     const url = $(this).attr('href')
    //     articles.push({
    //         title,
    //         url
    //     })
    // })
    // res.json(articles)

})

app.get('/news/:newspaperID', async (req, res) => {
    const newspaperID = req.params.newspaperID
    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperID)[0].address
    const newspaperbase = newspapers.filter(newspaper => newspaper.name == newspaperID)[0].base

    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specarticles = []

            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specarticles.push({
                    title,
                    url: newspaperbase + url,
                    source: newspaperID
                })
            })
            res.json(specarticles)
        })

})

app.listen(PORT, () => console.log(`server running on port ${PORT}`))

