## Clone the repository and run the following commands:

### Download and install git from [here](https://git-scm.com/downloads)

* Then clone the repository by running the following command in your terminal
```commandline
    git clone https://github.com/CRACK-BREAK-MAKE/improve-grammar-tone.git
```

### Download and install NodeJS from [here](https://nodejs.org/en/download)
* If you are using Windows machine, if you get `UnAuthorizedAccess` error on Powershell, run the following command on Powershell as Administrator
* ```commandline
    Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
    ```
* Then run the following command to verify installation
* ```commandline
    npm -v
    ```
* Open the project directory in your terminal and run the following command to install the required packages
* ```commandline
    npm install
    ```
* Then run the following command to create dist folder
* ```commandline
    npx webpack --mode production
    ```

### Start Local Ollama server
* Run the following command to start the server
* ```commandline
    OLLAMA_ORIGINS=chrome-extension://* ollama serve
    ```
