import { useEffect, useRef, useState } from "react";

// form
import { useForm } from "react-hook-form";
// @mui
import { Typography, Stack } from "@mui/material";
// redux
import { useDispatch, useSelector } from "../../../../redux/store";
// hooks

import { FormProvider } from "../../../../components/hook-form";
// sections
import {
  // ShopTagFiltered,
  // ShopProductSort,
  // ShopProductSearch,
  // ShopProductList,
  ShopProductListServices,
  ShopTagFilteredServices,
  ShopFilterSidebarServices,
  // ShopProductSearchServices,
} from "../../../../sections/@dashboard/e-commerce/shop";
// import CartWidget from "../../sections/@dashboard/e-commerce/CartWidget";
import { setLoading } from "src/features/globalSlice";

import { getAllDataList } from "src/components/core-functions/CoreFunctions";
import { filterVehicles, setVehiclesList } from "src/redux/slices/carRental";
import { useSnackbar } from "notistack";

// ----------------------------------------------------------------------

export default function CarRentalVehiclesList() {
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const serviceCategoryList = [
    {
      id: "category01",
      serviceName: "Small Compact",
    },
    {
      id: "category02",
      serviceName: "Saloon",
    },
    {
      id: "category03",
      serviceName: "4x4",
    },
    {
      id: "category04",
      serviceName: "7 Seater",
    },
    {
      id: "category05",
      serviceName: "SUV",
    },
  ];

  const [openFilter, setOpenFilter] = useState(false);

  const { filters, vehiclesList } = useSelector((state) => state.carRental);

  const filteredProducts = applyFilter(vehiclesList, filters);

  const tempfetchVehiclesRef = useRef();

  useEffect(() => {
    tempfetchVehiclesRef.current();
  }, []);

  const fetchVehicles = async () => {
    dispatch(setLoading(true));

    let vehiclesListResult = await getAllDataList(
      process.env.REACT_APP_COLLECTION_VEHICLES
    );

    if (vehiclesListResult?.error) {
      enqueueSnackbar(
        `Error occured while fetching cars: ${vehiclesListResult?.message}`,
        { variant: "error" }
      );
      dispatch(setLoading(false));
    } else if (vehiclesListResult?.list) {
      dispatch(setVehiclesList(vehiclesListResult?.list));
      dispatch(setLoading(false));
    } else {
      enqueueSnackbar("Error occured. Please call an admin.", {
        variant: "error",
      });
      dispatch(setLoading(false));
    }
  };

  tempfetchVehiclesRef.current = fetchVehicles;

  const defaultValues = {
    // gender: filters.gender,
    serviceCategory: filters.serviceCategory,
    // colors: filters.colors,
    // priceRange: filters.priceRange,
    // rating: filters.rating,

    passengers: filters.passengers,
    luggage: filters.luggage,
    doors: filters.doors,
    transmission: filters.transmission,
    airConditioning: filters.airConditioning,
  };

  const methods = useForm({
    defaultValues,
  });

  const { reset, watch, setValue } = methods;

  const values = watch();

  const isDefault =
    // !values.priceRange &&
    // !values.rating &&
    // values.gender.length === 0 &&
    // values.colors.length === 0 &&
    values.serviceCategory?.length === 0 &&
    values.passengers === 0 &&
    values.luggage === false &&
    values.doors === 0 &&
    values.transmission === "" &&
    values.airConditioning === false;

  useEffect(() => {
    dispatch(filterVehicles(values));
  }, [dispatch, values]);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleResetFilter = () => {
    reset();
    handleCloseFilter();
  };

  const handleRemoveCategory = () => {
    setValue("serviceCategory", []);
  };

  const handleRemovePassengers = () => {
    setValue("passengers", 0);
  };

  const handleRemoveLuggage = () => {
    setValue("luggage", false);
  };

  const handleRemoveDoors = () => {
    setValue("doors", 0);
  };

  const handleRemoveTransmission = () => {
    setValue("transmission", "");
  };

  const handleRemoveAirConditioning = () => {
    setValue("airConditioning", false);
  };

  const handleRemoveRating = () => {
    setValue("rating", "");
  };

  return (
    <>
      <Stack
        spacing={2}
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ sm: "center" }}
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        {/* <ShopProductSearchServices /> */}

        <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
          <FormProvider methods={methods}>
            <ShopFilterSidebarServices
              onResetAll={handleResetFilter}
              isOpen={openFilter}
              onOpen={handleOpenFilter}
              onClose={handleCloseFilter}
              serviceCategoryList={serviceCategoryList}
            />
          </FormProvider>

          {/* <ShopProductSort /> */}
        </Stack>
      </Stack>

      <Stack sx={{ mb: 3 }}>
        {!isDefault && (
          <>
            <Typography variant="body2" gutterBottom>
              <strong>{filteredProducts.length}</strong>
              &nbsp;Cars found
            </Typography>

            <ShopTagFilteredServices
              filters={filters}
              isShowReset={!isDefault && !openFilter}
              onRemoveCategory={handleRemoveCategory}
              onResetAll={handleResetFilter}
            />
          </>
        )}
      </Stack>

      <ShopProductListServices
        products={filteredProducts}
        loading={!vehiclesList.length && isDefault}
      />
      {/* <CartWidget /> */}
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter(products, filters) {
  if (products?.length > 0) {
    // FILTER PRODUCTS
    if (filters.serviceCategory?.length > 0) {
      // Create a set of ids from the second array
      const secondArrayIds = new Set(
        filters.serviceCategory.map((obj) => obj.id)
      );

      // Filter the first array by checking if the id is in the set
      products = products.filter(
        (obj) =>
          obj?.serviceCategory &&
          obj?.serviceCategory?.length > 0 &&
          obj?.serviceCategory.some((categoryId) =>
            secondArrayIds.has(categoryId?.id)
          )
      );
    }

    if (filters.passengers > 0) {
      products = products.filter(
        (product) => product.passengers === filters.passengers
      );
    }

    if (filters.luggage !== undefined) {
      products = products.filter(
        (product) => product.luggage === filters.luggage
      );
    }

    if (filters.doors > 0) {
      products = products.filter((product) => product.doors === filters.doors);
    }

    if (filters.transmission) {
      products = products.filter(
        (product) => product.transmission === filters.transmission
      );
    }

    if (filters.airConditioning !== undefined) {
      products = products.filter(
        (product) => product.airConditioning === filters.airConditioning
      );
    }

    return products;
  } else return [];
}
