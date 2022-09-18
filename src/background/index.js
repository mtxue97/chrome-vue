function test () {
    console.log('from background');
}
test ();
let views = window.chrome.extension.getViews({
    type: 'popup'
});
if (views.length) {
    console.log(views[0].document.title)
}else {
    console.log('pop未打开')
}

window.chrome.runtime.onMessege.addListener(
    function(request, sender, sendResponse) {
        console.log(request, sender, sendResponse)
    }
)
