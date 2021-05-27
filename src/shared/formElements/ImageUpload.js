import React, { useRef, useState, useEffect } from "react";

import Button from "../UI/Button";
import "./ImageUpload.css";

const ImageUpload = (props) => {
    const [file, setFile] = useState();
    // const [previewUrl, setPreviewUrl] = useState();
    const [isValid, setIsValid] = useState(false)
    const [pickFile, setPickFile] = useState();

    const filePickerRef = useRef();

    useEffect(() => {
        if (!file) {
            return;
        }
        const fileReader = new FileReader();
        // fileReader.onload = () => {
        //     setPreviewUrl(fileReader.result)
        // }
        console.log(file);
        fileReader.readAsDataURL(file);
    }, [file])

    let pickedFile;
    const pickedHandler = event => {

        let fileIsValid = isValid
        if (event.target.files && event.target.files.length === 1) {
            pickedFile = event.target.files[0];
            setFile(pickedFile);
            setIsValid(true);
            setPickFile(pickedFile.name);
            fileIsValid = true;
        } else {
            setIsValid(false);
            fileIsValid = false;
        }
        console.log(pickedFile);
        props.onInput(props.id, pickedFile, fileIsValid);
    }

    const pickImageHandler = () => {
        filePickerRef.current.click();
    };

    return (
        <div className="form-control">
            <input
                id={props.id}
                style={{ display: "none" }}
                type="file"
                accept={props.fileTypes}//".jpg,.png,.jpeg"
                ref={filePickerRef}
                onChange={pickedHandler}
                name={props.fileTypes === '.mp3' ? 'audio' : 'image'}
            />
            <div className={`image-upload ${props.center && "center"}`}>
                {/*<div className="image-upload__preview mx-auto">*/}
                {/*    {previewUrl && <img src={previewUrl} alt="Preview" />}*/}
                {/*    {!previewUrl && <p>Please pick an image</p>}*/}
                {/*</div>*/}
                {pickFile && <p>{pickFile}</p>}
                <Button type="button" onClick={pickImageHandler}>
                    Pick {props.fileTypes === '.mp3' ? 'audio' : 'image'}
                </Button>
            </div>
            {!isValid && <p>{props.errorText}</p>}
        </div>
    );
};

export default ImageUpload;
