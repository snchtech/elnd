// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron');
const path = require('node:path');
const fs = require('fs');

const request = require('request');
const AdmZip = require('adm-zip');
var spawn = require('child_process').spawn;

// Get the path to the executable file of the Electron app
const exePath = app.getPath('exe');

// Get the directory path where the executable file is located
const exeDir = path.dirname(exePath);

const mainFolder = 'C:\\Users\\Home\\Desktop\\electronupd\\out\\electronupdt-win32-x64';//path.join(exeDir, '../../../', 'electronupdt-win32-x64');

//const mainFolder = 'C:\\Users\\Home\\Desktop\\updateElectron\\out';

//const myConsole = new console.Console(fs.createWriteStream('./output.txt'));


function renameOldVersionAppFiles() {
  fs.readdir(mainFolder, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }
  
  
    files.forEach((file) => {
      const oldPath = path.join(mainFolder, file);
      const newFileName = `old_${file}`;
  
      fs.rename(oldPath, path.join(mainFolder, newFileName), (err) => {
        if (err) {
          console.error(`Error renaming ${file}:`, err);
        } else {
          console.log(`Successfully renamed ${file} to ${newFileName}`);
        }
      });
    });
  });
}

/*
const deleteFolderRecursive = function (directoryPath, excludeFolder) {
  if (fs.existsSync(directoryPath)) {
    fs.readdirSync(directoryPath).forEach((file) => {
      const curPath = path.join(directoryPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        if (file !== excludeFolder) {
          deleteFolderRecursive(curPath, excludeFolder);
        }
      } else {
        fs.unlinkSync(curPath);
      }
    });
    if (path.basename(directoryPath) !== excludeFolder) {
      fs.rmdirSync(directoryPath);
    }
  }
};*/

/*const deleteFolderRecursive = function (directoryPath, excludeFolder) {
  if (fs.existsSync(directoryPath)) {
      fs.readdirSync(directoryPath).forEach((file) => {
          const curPath = path.join(directoryPath, file);
          if (fs.lstatSync(curPath).isDirectory()) {
              if (file !== excludeFolder) {
                  deleteFolderRecursive(curPath, excludeFolder);
              }
          } else {
              let isInsideExcludedFolder = false;
              let tempPath = curPath;
              while (path.dirname(tempPath) !== excludeFolder && path.dirname(tempPath) !== path.dirname(directoryPath)) {
                  tempPath = path.dirname(tempPath);
              }
              if (path.dirname(tempPath) === excludeFolder) {
                  isInsideExcludedFolder = true;
              }
              if (!isInsideExcludedFolder) {
                  fs.unlinkSync(curPath);
              }
          }
      });
      if (path.basename(directoryPath) !== excludeFolder) {
          fs.rmdirSync(directoryPath);
      }
  }
};*/

const deleteFolderRecursive = async function (directoryPath, excludeFolder) {
  if (fs.existsSync(directoryPath)) {
      fs.readdirSync(directoryPath)
          .filter(file => file !== excludeFolder) // Exclude the specified folder
          .forEach((file) => {
              const curPath = path.join(directoryPath, file);
              if (fs.lstatSync(curPath).isDirectory()) {
                  deleteFolderRecursive(curPath, excludeFolder);
                  if (fs.readdirSync(curPath).length === 0) {
                    fs.rmdirSync(curPath);
                  }
              } else {
                  fs.unlinkSync(curPath);
              }
          });
      /*if (path.basename(directoryPath) !== excludeFolder) {
        console.log(directoryPath + 'fffffffffff');
          //fs.rmdirSync(directoryPath);
      }*/

     
  }
};

//deleteFolderRecursive(mainFolder, 'updator');


setTimeout(async function () {
  //renameOldVersionAppFiles()
  await deleteFolderRecursive(mainFolder, 'updator');
  await checkUpdates('1.0.0');
 

  /*deleteFolderRecursive(mainFolder, 'updator').then(
    checkUpdates('1.0.0').then(
      app.quit()
    )
    );*/
}, 5000);





// Function to download and extract the update zip project
async function downloadAndExtractUpdate(updateUrl, updateFolder) {
  const zipFilePath = path.join(updateFolder, 'update.zip');
  
  // Download the update zip project from the provided URL
  request(updateUrl)
      .pipe(fs.createWriteStream(zipFilePath))
      .on('close', () => {
          // Extract the downloaded zip file
          const zip = new AdmZip(zipFilePath);
          zip.extractAllTo(updateFolder, true);
          
          // Delete the downloaded zip file
          fs.unlinkSync(zipFilePath);
      });
      //app.quit()
}




async function checkUpdates( version ) {
  return fetch( 'http://electronupdt.loc/updates.json' )
  .then(res => res.json() )
  .then( async json => {
    if( json.version > version ) {
      this.updateWindow = new BrowserWindow( { width: 400, height: 200 } )
      this.updateWindow.loadFile( `update.html` )
      //this.window.on( 'closed', f => this.updateWindow = null )
      if( process.env.debug ) this.updateWindow.webContents.openDevTools( )


      // Example usage
      const updateUrl = json.link;
      const updateFolder = mainFolder;
      //console.log(app.getPath('userData'));
      //renameOldVersionAppFiles();
      await downloadAndExtractUpdate(updateUrl, updateFolder); 
    }
  } )
}









function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
