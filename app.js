let clip = document.getElementById("clip")
let myClips = []
let clipsContainer = document.getElementById("clips")
let save = document.getElementById("save-clip")
let clear = document.getElementById("clear-clip")
let deleteAll = document.getElementById("delete-all")
let note = document.getElementById("note")
let clipTarget = document.getElementsByClassName('cliptarget')
let clipsFromLocalStorage = JSON.parse( localStorage.getItem("myClips"))


if(clipsFromLocalStorage) {
    myClips = clipsFromLocalStorage
    render(myClips)
}


save.addEventListener("click", function(){
    myClips.push(clip.value)
    clip.value = ""
    localStorage.setItem("myClips", JSON.stringify(myClips))
    render(myClips)
})

function render(clips) {
    let listItems = ""
    for(let i = 0; i < clips.length; i++)
    {
        listItems += `
        <li class="clip_target_wrapper">
            <div class="copy-btn-wrapper">
            <button class="copy-btn copy-${i}">COPY</button>
            </div>
            <div>
                <p class="cliptarget clip-${i}" id="note">${myClips[i]}</p>
            </div>
            <div class="del_btn_wrapper">
                <button class="del-btn del-${i}">DELETE
            </div>
        </li>
        `
        clipsContainer.innerHTML = listItems
        
    }
    let copyBtn = document.getElementsByClassName("copy-btn")
    let deleteBtn = document.getElementsByClassName("del-btn")
    for(let i = 0; i< copyBtn.length; i++)
    {
        copyBtn[i].addEventListener('click', function(event){
            const thisCopyBtn = event.target;
            const parent = thisCopyBtn.closest('p')
            navigator.clipboard.writeText(clips[i])
        })
    }

    for(let i =0 ; i<= deleteBtn.length-1; i++){
        deleteBtn[i].addEventListener('click', function(event){
            let index = i
            const thisDeleteBtn = event.target;
            const parent = thisDeleteBtn.closest('li')
            parent.remove()
            delete clips[index]
            clips.splice(index,1)
            localStorage.setItem("myClips", JSON.stringify(clips))
            console.log(clipsFromLocalStorage)
            render(clips)
        })  
    }

}



clear.addEventListener("click", function(){
    clip.value = ""
})

deleteAll.addEventListener("dblclick", function(){
    localStorage.clear()
    myClips=[]
    render(myClips)
    clipsContainer.innerHTML = ""
})



