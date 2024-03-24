const { app, BrowserWindow } = require('electron/main')

const path = require('path');
const fs = require('fs');
const request = require('request');
const AdmZip = require('adm-zip');
var spawn = require('child_process').spawn;




// Get the path to the executable file of the Electron app
const exePath = app.getPath('exe');

// Get the directory path where the executable file is located
const exeDir = path.dirname(exePath);

// Specify the name of the directory you want to create
const directoryName = 'updator';



// Create the directory in the same folder as the executable file
const directoryPath = path.join(exeDir, directoryName);

const currentAppPath = app.getAppPath();

console.log(currentAppPath);

const mainFolder = path.join(exeDir, '..', 'electronupdt-win32-x64');

console.log('RR', mainFolder);



/*const oldFolderName = 'electronupdt-win32-x64';
const newFolderName = 'old_electronupdt-win32-x64';

// Rename the existing Electron application folder
fs.rename(oldFolderName, newFolderName, (err) => {
  if (err) {
    console.error('Error renaming folder:', err);
    return;
  }
  console.log('Folder renamed successfully.');

  // Create a new folder with the original app name
  fs.mkdir(oldFolderName, (err) => {
    if (err) {
      console.error('Error creating new folder:', err);
      return;
    }
    console.log('New folder created successfully.');

    // Move contents from renamed folder to new folder
    fs.readdir(newFolderName, (err, files) => {
      if (err) {
        console.error('Error reading directory:', err);
        return;
      }
    });
  });
});*/

// Check if the app path contains the directory "updateversion"
/*if (currentAppPath.includes('updateversion')) {
  console.log('The app path contains the directory "updateversion"');
   // Delete old files in the main folder
   fs.readdirSync(mainFolder).forEach(file => {
    fs.unlinkSync(path.join(mainFolder, file));
  });

  // Copy new version files to the main folder
  exec(`cp -r ${directoryPath}/* ${mainFolder}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error copying files: ${error}`);
      return;
    }
    console.log('New version files copied successfully.');
  });
} else {
  console.log('The app path does not contain the directory "updateversion"');
}

app.setPath('userData', directoryPath);*/


// Function to start the executable file
/*function startExecutable() {
  const exePath = path.join(directoryPath, 'electronupdt.exe');
  
  const child = spawn(exePath, [], {
    detached: true,
    stdio: 'ignore'
  });

  child.unref();
}

// Call the function to start the executable file
app.on('ready', () => {
  startExecutable();
});*/

// Function to start the executable file
function startExecutable() {
  const exePath = path.join(directoryPath, 'electron-quick-start.exe');
  const child = spawn(exePath, [], { detached: true, stdio: 'ignore' });
  child.unref();
}

// Close the old app version before starting the new version
app.on('ready', () => {
  startExecutable();
  // Close the Electron app
  app.quit();
});

/*
fs.mkdir(directoryPath, { recursive: true }, (err) => {
  if (err) {
    console.error('Error creating directory:', err);
  } else {
    console.log('Directory created successfully:', directoryPath);
  }
});

*/






function renameOldVersionAppFiles() {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }
  
  
    files.forEach((file) => {
      const oldPath = path.join(directoryPath, file);
      const newFileName = `old_${file}`;
  
      fs.rename(oldPath, path.join(directoryPath, newFileName), (err) => {
        if (err) {
          console.error(`Error renaming ${file}:`, err);
        } else {
          console.log(`Successfully renamed ${file} to ${newFileName}`);
        }
      });
    });
  });
}



/*const appFolder = exeDir;
const tempFolder = directoryPath;

function replaceFiles() {
    fs.readdir(tempFolder, (err, files) => {
        if (err) {
            console.error('Error reading temporary folder:', err);
            return;
        }

        files.forEach(file => {
            const tempFilePath = path.join(tempFolder, file);
            const appFilePath = path.join(appFolder, file);

            fs.copyFile(tempFilePath, appFilePath, (err) => {
                if (err) {
                    console.error(`Error replacing ${file}:`, err);
                } else {
                    console.log(`Successfully replaced ${file}`);
                }
            });
        });
    });
}*/




// Function to download and extract the update zip project
function downloadAndExtractUpdate(updateUrl, updateFolder) {
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
}

function checkUpdateFolder() {

  //const directoryPath = path.join(exePath, 'updateversion');

  //console.log(directoryPath);

  let result;

  if (fs.existsSync(directoryPath)) {
    result = true
  } else {
    result = false;
  }

  return result;
  /*
  fs.access(directoryPath, fs.constants.F_OK, (err) => {
    if (err) {
      result = false;
    } else {
      result = true
    }
  });*/

  console.log(result);
}







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
};






async function checkUpdates( version ) {
  return fetch( 'http://electronupdt.loc/updates.json' )
  .then(res => res.json() )
  .then( json => {
    if( json.version > version ) {
      this.updateWindow = new BrowserWindow( { width: 400, height: 200 } )
      this.updateWindow.loadFile( `update.html` )
      //this.window.on( 'closed', f => this.updateWindow = null )
      if( process.env.debug ) this.updateWindow.webContents.openDevTools( )


      // Example usage
      const updateUrl = json.link;
      const updateFolder = directoryPath;
      //console.log(app.getPath('userData'));
      //renameOldVersionAppFiles();
      //downloadAndExtractUpdate(updateUrl, updateFolder);

      
      let checkUpdateDirectory = checkUpdateFolder();

      console.log('WWWWWW', checkUpdateDirectory);


      if(checkUpdateDirectory) {
          const newVersionFolder = directoryPath;//path.join(exeDir, 'updateversion'); // Path to the new version folder
          // Update the app to use the new version folder

          console.log('NNNNNNNNN', newVersionFolder);
          /*app.setPath('userData', newVersionFolder);

          // Create a new BrowserWindow and load your app
          app.on('ready', () => {
            const mainWindow = new BrowserWindow({
              width: 800,
              height: 600,
              webPreferences: {
                nodeIntegration: true
              }
            });

        mainWindow.loadFile('index.html');
      });*/

          // Start the app from the new version folder
         // app.relaunch();
         // app.quit();

          /*const appFolderPath = exeDir;
          const excludeFolderName = 'updateversion';
          deleteFolderRecursive(appFolderPath, excludeFolderName);*/
      }
      
      
      
    }
  } )
}

//checkUpdates('1.0.0');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})