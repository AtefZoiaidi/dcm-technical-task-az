import React from 'react';
import { render, screen,fireEvent,wait } from '@testing-library/react';
import UploadNewFile from './UploadNewFile';
import userEvent from '@testing-library/user-event';

test('render file input',()=>{
    render(<UploadNewFile />);
    const buttonUpload =  screen.getByRole(/button/i)
    const inputFile = screen.getByTestId(/input-file/i)
    expect(buttonUpload).toBeInTheDocument()
    expect(inputFile).toBeInTheDocument()
    expect(buttonUpload).toBeDisabled()
})

test('select image file',()=>{
    render(<UploadNewFile />);
    const image = new File(['Hello'], 'file.png', {type:'image/png'})
    const buttonUpload =  screen.getByRole(/button/i)
    const inputFile = screen.getByTestId(/input-file/i)
    fireEvent.change(inputFile,{
        target:{files:[image]}
    })
    expect(inputFile.files).toHaveLength(1)
    expect(buttonUpload).toBeDisabled()
    const alert = screen.getByTestId(/alert-danger/i)
    expect(alert).toBeInTheDocument()

})

test('select python file',()=>{
    render(<UploadNewFile />);
    const file_py = new File(['hello'], 'file.py', {type:'text/x-python'})
    const buttonUpload =  screen.getByRole(/button/i)
    const inputFile = screen.getByTestId(/input-file/i)
    fireEvent.change(inputFile,{
        target:{files:[file_py]}
    })
    expect(inputFile.files).toHaveLength(1)
    expect(buttonUpload).not.toBeDisabled()
    
})

test('upload python file', async ()=>{
    render(<UploadNewFile />);
    const file_py = new File(['hello'], 'file.py', {type:'text/x-python'})
    const buttonUpload =  screen.getByRole(/button/i)
    const inputFile = screen.getByTestId(/input-file/i)
    fireEvent.change(inputFile,{
        target:{files:[file_py]}
    })
    userEvent.click(buttonUpload)
    await wait(() => {
        const alert = screen.getByTestId(/alert-success/i)
        expect(alert).toBeInTheDocument()
        expect(inputFile.files[0]).toMatchObject({})
    })

})