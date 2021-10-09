let clip = document.getElementById("clip")
let clips = []
let clipsContainer = document.getElementById("clips")
let save = document.getElementById("save-clip")
let clear = document.getElementById("clear-clip")
let deleteAll = document.getElementById("delete-all")

save.addEventListener("click", function(){
    clips.push(clip.value)
    clip.value = ""
    localStorage.setItem(clips, clip.value)
    render(clips)
})

function render(clips) {
    let listItems = ""
    for(let i = 0; i < clips.length; i++)
    {
        listItems += `
        <li>
            <div>
                <p class="clip-${i} id="note">${clips[i]}</p>
            </div>
            <div>
                <button class="del-${i}">DELETE
            </div>
        </li>
        `
        clipsContainer.innerHTML = listItems
    }
}

clear.addEventListener("click", function(){
    clip.value = ""
})

deleteAll.addEventListener("dblclick", function(){
    localStorage.clear()
    clips=[]
    render(clips)
    clipsContainer.innerHTML = ""
})

let note = document.getElementById("note")

note.addEventListener("mouseover", function(){
    note.innerHTML += `<button class="del">DELETE<button>`
})