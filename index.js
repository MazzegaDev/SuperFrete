    let history = JSON.parse(localStorage.getItem('goalHistory')) || [];
    window.addEventListener('DOMContentLoaded', ()=> renderHistory());
    function calc(){
        let sleepHrs = document.getElementById('horaDormir').value;
        let wakeUpHrs = document.getElementById('horaAcordar').value;
        let sleepGoal = parseFloat(document.getElementById('metaSono').value);
        let result = document.getElementById('resultado');
        let list = document.getElementById('listaMetas');

        if(!sleepHrs || !wakeUpHrs || isNaN(sleepGoal)){
            result.innerText = 'Por favor, preencha todos os campos.';
        }else{
            let sleepTime = calcSleep(sleepHrs,wakeUpHrs);
            sleepTime = sleepTime.toFixed(2);
            if(sleepTime < sleepGoal){
                result.innerText = `Você vai dormir ${sleepTime} horas. Abaixo da meta. 💤`;
            }
            else if(sleepTime === sleepGoal){
                result.innerText = `Você vai dormir ${sleepTime} horas. Meta de sono atingida! ✅`
            }
            else{
                result.innerText = `Você vai dormir ${sleepTime} horas. Acima da meta de sono!  😴`
            }

            addToList(list, sleepTime, sleepGoal);
        }
        
        

    }

    function addToList(list,sleepTime, sleepGoal){
        
        let li = document.createElement('li');
        let msg = '';

        if(sleepTime < sleepGoal){
            msg = `Com uma meta de sono de ${sleepGoal} Horas - Você vai dormir ${sleepTime} horas. Essa não e uma meta ideal! ❌`;
        }
        else if(sleepTime === sleepGoal){
            msg = `Com uma meta de sono de ${sleepGoal} horas - Você vai dormir ${sleepTime} horas. Esses horarios atigem perfeitamente sua meta! ✅`;
        }
        else{
            msg = `Com uma meta de sono de ${sleepGoal} horas - Você vai dormir ${sleepTime} horas. Você vai dormir mais que sua meta com esses horarios! 😴✅`;
        }
        li.textContent = msg;
        list.appendChild(li);
        
        saveLocal(msg);
       
        li.addEventListener('click', () => {
            list.removeChild(li);
            renderHistory();
        })
    }

    function saveLocal(msg){
        let [firstString, lastString] = msg.split('-');
        let key = 'goalHistory';
        let obj = {id: Date.now(),firstMsg: firstString, lastMsg: lastString};
        history.push(obj);
        let toJSON = JSON.stringify(history);
        localStorage.setItem(key, toJSON);
        
    
    }

    function renderHistory(){
        let jsonIten = JSON.parse(localStorage.getItem('goalHistory'));
        let itens = jsonIten;
        history = JSON.parse(localStorage.getItem('goalHistory')) || [];
        let list = document.getElementById('listaMetas');

        list.innerHTML = '';
        itens.forEach(element => {
            let li = document.createElement('li');
            li.setAttribute('data-id',element.id);
            let msg = `${element.firstMsg} - ${element.lastMsg}`;
            li.textContent = msg;
            list.appendChild(li);

            li.addEventListener('click', ()=>{
                let id = li.getAttribute('data-id');
                history = history.filter(item => item.id != id);
                localStorage.setItem('goalHistory', JSON.stringify(history));
                list.removeChild(li);
            })
        });
    }


    function calcSleep(sleepHrs,wakeUpHrs){
        let [sleepH, sleepMin] = sleepHrs.split(':').map(Number);
        let [wakeHrs, wakeMin] = wakeUpHrs.split(':').map(Number);

        

        const dateSleep = new Date();
        dateSleep.setHours(sleepH,sleepMin,0);

        const dateWakeUp = new Date();
        dateWakeUp.setHours(wakeHrs,wakeMin,0);

        //Diferanca do pulo da madrugada
        if(dateWakeUp <= dateSleep){
            dateWakeUp.setDate(dateWakeUp.getDate() + 1);
        }

        let HrsDiff = dateWakeUp - dateSleep;
        let TotalHoursSleep = HrsDiff / (1000*60*60);
        console.log(TotalHoursSleep);
        return TotalHoursSleep;
    }

    
    

