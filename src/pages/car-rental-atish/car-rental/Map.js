import { useTheme } from "@mui/material";

function Map() {
  const theme = useTheme();
  return (
    <div style={{ backgroundColor: theme.palette.grey[200] }}>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3738.7720055546392!2d57.676151674803805!3d-20.43346148107103!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x217c8ae0b03bb125%3A0xf1f11c4736d0f5cf!2sSir%20Seewoosagur%20Ramgoolam%20International%20Airport!5e0!3m2!1sen!2smu!4v1729484689524!5m2!1sen!2smu"
        width="100%"
        height="500px"
        id="mapId"
        title="mapTitle"
        display="block"
        position="relative"
      />
    </div>
  );
}

export default Map;
