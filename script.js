    const quoteContainer = document.getElementById('quote-container')
    const quoteContent = document.getElementById('quote-content')
    const quoteText = document.getElementById('quote')
    const authorText = document.getElementById('author')
    const loader = document.getElementById('loader');
    const clock = document.getElementById('clock-container');
    const mainTaskInp= document.getElementById('main-task-input');
    const doneMessageDiv = document.getElementById('doneMessage');
    let mainTask = '';

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
        var t = setTimeout(getTime, 500);
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

    function getMainTask(){
        mainTask = localStorage.getItem('mainTask');
        if(mainTask && mainTask.length>0) 
        {
            // console.log('here coz mainTask is set in local storage', mainTask);
            showMainTask();
            document.getElementById('mainTaskText').innerText = mainTask;
        } else {
            hideMainTask();
            mainTaskInp.addEventListener("keyup", function(event) {
                // Number 13 is the "Enter" key on the keyboard
                if (event.keyCode === 13) {
                 // console.log(mainTaskInp.value);
                 mainTask = mainTaskInp.value;
                 localStorage.setItem('mainTask',mainTaskInp.value);
                  // Cancel the default action, if needed
                  event.preventDefault();
                  showMainTask();
                  document.getElementById('mainTaskText').innerText = mainTask;
                }
              });
        }
    }

    function showMainTask(){
        // console.log('task input block being hidden');
        taskDiv = document.getElementById('task-show');
        taskDiv.style.display = 'inline-block';

        taskInp = document.getElementById('task-input');
        taskInp.style.display = 'none';
    }

    function hideMainTask() {
        // console.log('task show block being hidden');
        document.getElementById('task-show').style.display = 'none';
        document.getElementById('task-input').style.display = 'inline-block';
    }

    function taskDone()
    {   
        checked = document.getElementById('taskCheckbox').checked;
        console.log(checked);
        
        if(checked) {
            document.getElementById('mainTaskText').style.textDecoration = 'line-through';            
            doneMessageDiv.classList.add('fade');
            setTimeout(function() { doneMessageDiv.classList.remove('fade') }, 3000)

        } else {           
            document.getElementById('mainTaskText').style.textDecoration = 'none';
            doneMessageDiv.classList.remove('fade');
        }
    }

    function removeTask()
    {
        mainTask = '';
        localStorage.setItem('mainTask','');
        mainTaskInp.value = '';
        document.getElementById('taskCheckbox').checked = false;
        document.getElementById('mainTaskText').style.textDecoration = 'none';
        getMainTask();
    }

    function showTaskOptions()
    {
        document.getElementById('removeTaskDiv').style.display = 'inline-block';
        document.getElementById('taskCheckboxDiv').style.display = 'inline-block';
    }

    function hideTaskOptions() 
    {
        document.getElementById('removeTaskDiv').style.display = 'none';
        document.getElementById('taskCheckboxDiv').style.display = 'none';
    }


    // On Load
    getTime();
    getQuote();
    getMainTask();