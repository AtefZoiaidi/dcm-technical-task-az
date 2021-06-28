import React, {Component}  from 'react';
import axios from './../../axios-api'
class UploadNewFile extends Component {
    state = {
        fileInput:null,
        selectedFile : null,
        error:null,
        success:null
    };
    onInputChange = event => {
       this.setState({error:null})
       var file = event.target.files[0];

       if(file){
            var  extension =  file.name.split('.').pop()
            if (extension !== 'py'){
                event.target.value = '';
                this.setState({error:"Please select python file!"})
            }else{

                this.setState({error:null, selectedFile:file, fileInput:event.target})
            }
       }

    }
    onUploadFile = () =>{
        this.setState({error:null})
        var formData =  new FormData()
        formData.append("file",this.state.selectedFile)
        axios.post('upload-file', formData).then(response => {
            this.setState({success: response.data.message})
            this.state.fileInput.value = ""
             const timer = setTimeout(() => {
                  window.location.reload()
                // this.setState({success: null})
              }, 2000);
              return () => clearTimeout(timer);
          }).catch(error => {
            this.setState({error: "Fail to upload file !"})
          })
    }

   render(){
       return(
        <div className="row">
            <div className="col-12">
            <fieldset>
                <legend>Upload New file Test</legend>
                <div className="row">
                    <div className="col-12">
                        {this.state.error && <div data-testid="alert-danger" className="alert alert-danger">{this.state.error}</div>}
                        {this.state.success && <div data-testid="alert-success" className="alert alert-success">{this.state.success}</div>}
                    </div>
                    <div className="col-6 col-md-6">
                        <input type="file" name="file" data-testid="input-file" onChange={this.onInputChange}/>
                    </div>
                    <div className="col-6 col-md-6 d-flex justify-content-end">
                        <input disabled={this.state.error || !this.state.selectedFile} type="button" className="btn btn-primary" value="Upload" id="btnupload"  onClick={this.onUploadFile}/>
                    </div>
                </div>
            </fieldset>
            </div>
            
        </div>
        
       )
   }
}
export default UploadNewFile;