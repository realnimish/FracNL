export default function Alert(props) {
  return (
    <Snackbar
      open={props.open}
      autoHideDuration={props.duration ? props.duration : 6000}
      onClose={props.handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert onClose={handleClose} severity={props.type} sx={{ width: "100%" }}>
        {props.message}
      </Alert>
    </Snackbar>
  );
}
