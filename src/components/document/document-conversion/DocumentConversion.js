import { Autocomplete, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectDocument,
    setDocumentType,
} from '../../../features/documentSlice';
import { useState } from 'react';

export default function DocumentConversion({
    documentDetails,
    setDocumentDetails,
    set_us_actionChoice,
    classStyle,
}) {
    const dispatch = useDispatch();

    const { documents } = useSelector(selectDocument);

    const [selectedDocument, set_selectedDocument] = useState(null);

    const handleSelectChange = async (e, value, reason) => {
        e.preventDefault();
        if (reason !== 'removeOption' && reason !== 'clear' && value) {
            set_selectedDocument(value);

            dispatch(
                setDocumentType({
                    ...value,
                }),
            );

            set_us_actionChoice('create');

            setDocumentDetails({ ...documentDetails });
        } else if (reason === 'removeOption' || reason === 'clear') {
            set_selectedDocument(null);
        }
    };

    return (
        <>
            <Autocomplete
                ListboxProps={{ style: { maxHeight: '70vh' } }}
                size="small"
                label="Convert to other document type"
                id="document-conversion-drop-down"
                options={documents}
                value={selectedDocument || null}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Convert to other document type"
                        InputLabelProps={{ required: true }}
                    />
                )}
                required
                onChange={(e, value, reason) =>
                    handleSelectChange(e, value, reason, 'client')
                }
                getOptionLabel={(option) => option.title}
                className={classStyle}
                style={{ borderRadius: '10px' }}
            />
        </>
    );
}
