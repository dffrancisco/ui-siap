const path = require('path');
const { app, BrowserWindow, screen } = require('electron');

const isDev = process.env.IS_DEV == "true" ? true : false;
let win

function createWindow() {
    const size = screen.getPrimaryDisplay().workAreaSize;

    win = new BrowserWindow({
        // width: 800,
        // height: 600,
        width: size.width,
        height: size.height,

        // modal: true,
        // webSecurity: false,
        // webContents:{
        //     print:{
        //         silent
        //     }
        // },
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            plugins: true,
            // enableRemoteModule: true
        },
        fullscreen: false,
        icon: path.join(__dirname, '../dist/icons/icon.png'),
        // icon: path.join(globalAny.__static, os.platform() === 'win32' ? 'icons/icon.ico' : 'icons/64x64.png'),
        backgroundColor: '#f3fffd',
        autoHideMenuBar: true,
    });
    // win.setMenuBarVisibility(false)

    // win.webContents.print({
    //     silent: true,
    //     printBackground: true
    // })

    // win.loadFile("index.html");
    win.loadURL(
        isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, '../dist/index.html')}`
    );

    // Open the DevTools.
    if (isDev) win.webContents.openDevTools();
    win.setFullScreen(!isDev)


    // win.getFocusedWindow()

    // win.webContents.on('did-finish-load', () => {
    //     try {

    //         console.log("content loaded");

    //         // const window = BrowserWindow.getFocusedWindow();
    //         win.webContents.print({}, (success, errorType) => {
    //             console.log(success);
    //         });

    //     } catch (error) {
    //         console.log(error);
    //     }
    // });

}

app.whenReady().then(() => {

    createWindow()
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

});




app.on('closed', () => app = null);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});


// console.log(win.webContents.getPrinters());

// var options = {
//     // silent: false,
//     // printBackground: true,
//     color: false,
//     margin: {
//         marginType: 'printableArea'
//     },
//     landscape: false,
//     pagesPerSheet: 1,
//     collate: false,
//     copies: 1,
//     header: 'Header of the Page',
//     footer: 'Footer of the Page'
// }


// setTimeout(() => {

//     win.webContents.print(options, (success, failureReason) => {
//         if (!success) console.log(failureReason);

//         console.log('Print Initiated');
//     });

// }, 5000);