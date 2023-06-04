import React, { useRef, useState, useEffect } from 'react'

import './ImageUpload.css';
import Button from './Button';



export default function ImageUpload(props) {

    const [file, setFile] = useState(undefined);
    const [previewUrl, setpreviewUrl] = useState(undefined);
    const [isValid, setIsValid] = useState(false);

    const filePickerRef = useRef();

    useEffect(() => {

        if (!file) {

            return;
        }

        const fileReader = new FileReader();

        fileReader.onload = () => {

            setpreviewUrl(fileReader.result);
        };
        fileReader.readAsDataURL(file);
    }, [file]);

    const pickHandler = event => {
        let pickedFile;
        let fileIsValid = isValid;
    
        if (event.target.files && event.target.files.length === 1) {
            pickedFile = event.target.files[0];
            setFile(pickedFile);
            setIsValid(true);
            fileIsValid = true;
        } else {
            setIsValid(false);
            fileIsValid = false;
        }
    
        props.onInput(props.id, pickedFile, fileIsValid);
    };
    

    function pickImageHandler() {

        filePickerRef.current.click();
    }

    return (
        <div className='form-control'>
            <input
                ref={filePickerRef}
                id={props.id}
                style={{ display: 'none' }}
                type='file'
                accept='.jpg,.png,.jpeg'
                onChange={pickHandler}
            />
            <div className={`image-upload ${props.center && 'center'}`}>
                <div className='image-upload__preview'>
                    {previewUrl && <img src={previewUrl} alt='Preview' />}
                    {!previewUrl && <p>Please pick an image.</p>}
                </div>
                <Button type='button' onClick={pickImageHandler}>PICK IMAGE</Button>
            </div>
            {!isValid && <p>{props.errorText}</p>}
        </div>
    );
}

