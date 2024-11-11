import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { useState } from 'react'

const LandingBookingForm = () => {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Book your car
      </Typography>

      <FormControl fullWidth margin="normal" variant='filled'>
        <InputLabel id="car-type-label">Car type</InputLabel>
        <Select
          labelId="car-type-label"
        >
          <MenuItem value="SUV">SUV</MenuItem>
          <MenuItem value="Sedan">Sedan</MenuItem>
          <MenuItem value="Convertible">Convertible</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal" variant='filled'>
        <InputLabel id="place-rental-label">Place of rental</InputLabel>
        <Select
          labelId="place-rental-label"
        >
          <MenuItem value="Port Louis">Port Louis</MenuItem>
          <MenuItem value="Rose Hill">Rose Hill</MenuItem>
          <MenuItem value="Vacoas">Vacoas</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal" variant='filled'>
        <InputLabel id="place-return-label">Place of return</InputLabel>
        <Select
          labelId="place-return-label"
        >
          <MenuItem value="Port Louis">Port Louis</MenuItem>
          <MenuItem value="Rose Hill">Rose Hill</MenuItem>
          <MenuItem value="Vacoas">Vacoas</MenuItem>
        </Select>
      </FormControl>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          value={startDate}
          onChange={(newValue) => setStartDate(newValue)}
          label="Rental date"
          renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
        />
      </LocalizationProvider>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          value={endDate}
          onChange={(newValue) => setEndDate(newValue)} 
          label="Return date"
          renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
        />
      </LocalizationProvider>

      <Button variant="contained" color="warning" fullWidth style={{ marginTop: '20px' }}>
        Book now
      </Button>
    </div>
  )
}

export default LandingBookingForm;