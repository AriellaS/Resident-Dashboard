const errorColor = "#ff9900";

const styles = {
    box: {
        width: "400px",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        borderRadius: "10px",
        boxShadow: "3px 5px 10px -2px gray",
        position: "fixed",
        textAlign: "center",
        backgroundColor: "white",
        padding: "30px",
    },
    boxHeader: {
        fontSize: "20px",
        fontWeight: "bold",
        padding: "10px"
    },
    inputContainer: {
        padding: "10px 0px 10px 0px",
        textAlign: "left",
        fontSize: "16px",
    },
    input: {
        width: "90%",
        padding: "10px",
        outline: "none",
        border: "1px solid #f0f0f0",
        borderRadius: "10px"
    },
    text: {
        color: "#303030",
        paddingBottom: "5px"
    },
    button: {
        backgroundColor: "#303030",
        borderRadius: "10px",
        color: "white",
        fontWeight: "bold",
        border: "none",
        width: "100%",
        height: "35px",
        cursor: "pointer",
        fontSize: "16px",
        marginTop: "15px",
    },
    link: {
        container: {
            fontSize: "13px",
            paddingTop: "20px",
        },
        text: { color: "blue" },
    },
    errorBox: {
        container: {
            backgroundColor: "#fff8ed",
            borderRadius: "5px",
            border: `1px solid ${errorColor}`,
            display: "flex",
            flexDirection: "row",
            width: "90%",
            padding: "8px",
            marginBottom: "5px",
        },
        glyph: {
            size: 20,
            color: errorColor,
        },
        message: {
            color: errorColor,
            fontSize: "13px",
            fontFamily: "helvetica",
            marginLeft: "5px",
        }
    }
}

export default styles;
