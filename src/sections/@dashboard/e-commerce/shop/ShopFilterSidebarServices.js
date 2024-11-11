import PropTypes from "prop-types";
// form
import { Controller, useFormContext } from "react-hook-form";
// @mui
import {
  Box,
  Stack,
  Button,
  Drawer,
  Divider,
  IconButton,
  Typography,
  Autocomplete,
  TextField,
  FormHelperText,
} from "@mui/material";
// @types
import { NAVBAR } from "../../../../config";
// components
import Iconify from "../../../../components/Iconify";
import Scrollbar from "../../../../components/Scrollbar";

// ----------------------------------------------------------------------

ShopFilterSidebarServices.propTypes = {
  isOpen: PropTypes.bool,
  onResetAll: PropTypes.func,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
};

export default function ShopFilterSidebarServices({
  isOpen,
  onResetAll,
  onOpen,
  onClose,
  serviceCategoryList,
}) {
  const { control } = useFormContext();

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        endIcon={<Iconify icon={"ic:round-filter-list"} />}
        onClick={onOpen}
      >
        Filters
      </Button>

      <Drawer
        anchor="right"
        open={isOpen}
        onClose={onClose}
        PaperProps={{
          sx: { width: NAVBAR.BASE_WIDTH },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 1, py: 2 }}
        >
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            Filters
          </Typography>
          <IconButton onClick={onClose}>
            <Iconify icon={"eva:close-fill"} width={20} height={20} />
          </IconButton>
        </Stack>

        <Divider />

        <Scrollbar>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1}>
              <Typography variant="subtitle1">Category</Typography>
              <Controller
                name="serviceCategory"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Autocomplete
                      {...field}
                      multiple
                      ListboxProps={{ style: { maxHeight: "70vh" } }}
                      size="large"
                      options={serviceCategoryList || []}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          InputLabelProps={{ required: true }}
                          size="large"
                        />
                      )}
                      onChange={(event, newValue) => field.onChange(newValue)}
                      getOptionLabel={(option) => option?.serviceName || ""}
                      fullWidth
                    />

                    {!!error && (
                      <FormHelperText error sx={{ px: 2 }}>
                        {error.message}
                      </FormHelperText>
                    )}
                  </>
                )}
              />
            </Stack>
          </Stack>
        </Scrollbar>

        <Box sx={{ p: 3 }}>
          <Button
            fullWidth
            size="large"
            type="submit"
            color="inherit"
            variant="outlined"
            onClick={onResetAll}
            startIcon={<Iconify icon={"ic:round-clear-all"} />}
          >
            Clear All
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
