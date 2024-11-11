import PropTypes from "prop-types";
// @mui
import { styled } from "@mui/material/styles";
import {
  Grid,
  Rating,
  Button,
  Typography,
  LinearProgress,
  Stack,
  Link,
} from "@mui/material";
// utils
import { fPercent, fShortenNumber } from "../../../../utils/formatNumber";
// components
import Iconify from "../../../../components/Iconify";
import useAuth from "src/hooks/useAuth";
import { useSnackbar } from "notistack";

// ----------------------------------------------------------------------

const RatingStyle = styled(Rating)(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

const GridStyle = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(3),
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  justifyContent: "center",
  "&:nth-of-type(2)": {
    [theme.breakpoints.up("md")]: {
      borderLeft: `solid 1px ${theme.palette.divider}`,
      borderRight: `solid 1px ${theme.palette.divider}`,
    },
  },
}));

// ----------------------------------------------------------------------

ProductDetailsReviewOverview.propTypes = {
  product: PropTypes.object,
  onOpen: PropTypes.func,
};

export default function ProductDetailsReviewOverview({ product, onOpen }) {
  const { enqueueSnackbar } = useSnackbar();

  const { isAuthenticated } = useAuth();

  const { totalRating, totalReview, ratings } = product;

  return (
    <Grid container>
      <GridStyle item xs={12} md={4}>
        <Typography variant="subtitle1" gutterBottom>
          Average rating
        </Typography>
        <Typography variant="h2" gutterBottom sx={{ color: "error.main" }}>
          {totalRating}/5
        </Typography>
        <RatingStyle readOnly value={totalRating} precision={0.1} />
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          ({fShortenNumber(totalReview)}
          &nbsp;reviews)
        </Typography>
      </GridStyle>

      <GridStyle item xs={12} md={4}>
        <Stack spacing={1.5} sx={{ width: 1 }}>
          {ratings &&
            ratings?.length > 0 &&
            ratings
              .slice(0)
              .reverse()
              .map((rating) => <ProgressItem key={rating.id} star={rating} />)}
        </Stack>
      </GridStyle>

      <GridStyle item xs={12} md={4}>
        <Link href="#move_add_review" underline="none">
          <Button
            size="large"
            onClick={() => {
              if (isAuthenticated) {
                onOpen();
              } else {
                enqueueSnackbar(
                  "Please login/register before adding a review.",
                  { variant: "info" }
                );
              }
            }}
            variant="outlined"
            startIcon={<Iconify icon={"eva:edit-2-fill"} />}
            sx={{ textTransform: "none" }}
          >
            Write your review
          </Button>
        </Link>
      </GridStyle>
    </Grid>
  );
}

// ----------------------------------------------------------------------

ProgressItem.propTypes = {
  star: PropTypes.object,
};

function ProgressItem({ star }) {
  const { review, rating } = star;

  let percentage = Number(rating || 0) / Number(5);

  return (
    <Stack direction="row" alignItems="center" spacing={1.5}>
      <Typography variant="subtitle2">{review}</Typography>
      <LinearProgress
        variant="determinate"
        value={percentage * 100}
        sx={{
          mx: 2,
          flexGrow: 1,
          bgcolor: "divider",
        }}
      />
      <Typography
        variant="body2"
        sx={{ color: "text.secondary", minWidth: 64, textAlign: "right" }}
      >
        {fPercent(percentage * 100)}
      </Typography>
    </Stack>
  );
}
