    const quoteContainer = document.getElementById('quote-container')
    const quoteContent = document.getElementById('quote-content')
    const quoteText = document.getElementById('quote')
    const authorText = document.getElementById('author')
    const loader = document.getElementById('loader');
    const clock = document.getElementById('clock-container');


    function getTime() {
        var today = new Date();
        var h = today.getHours();
        var m = today.getMinutes();
        var s = today.getSeconds();
        // add a zero in front of numbers<10
        if (m < 10) {
            m = "0" + m;
        }
       
        clock.innerText = h + ":" + m ;
    }

    


    //Get Quote from API
    async function getQuote() {
        const proxyURL = 'https://cors-anywhere.herokuapp.com/'
        apiUrl = "http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json";
        try {
            loading();
            const response = await fetch(proxyURL + apiUrl);
            const data = await response.json();
            console.log(data);
            if (data.quoteAuthor === '') {
                authorText.innerText = 'Unknown'
            } else {
                authorText.innerText = data.quoteAuthor;
            }

            quoteText.innerText = data.quoteText;
            loadingComplete();
        } catch (error) {
            getQuote();
            console.log('Oops no quote!' + error);

        }
    }

    function tweetQuote() {
        const quote = quoteText.innerText;
        const author = authorText.innerText;
        const twitterApiUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`
        window.open(twitterApiUrl, '_blank')

    }

    function loading() {
        loader.hidden = false;
        quoteContent.hidden = true;
    }

    function loadingComplete() {
        if (!loader.hidden) {
            quoteContent.hidden = false;
            loader.hidden = true;
        }
    }


    // On Load
    getTime();
    getQuote();