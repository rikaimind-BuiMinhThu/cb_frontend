import React from 'react'

function ChatbotOption() {

    function loadFile(event) {
        var output = document.getElementById('output');
        output.src = URL.createObjectURL(event.target.files[0]);
        output.onload = function () {
            URL.revokeObjectURL(output.src) // free memory
        }
    };

    return (
        <div>
            <h6>Option</h6>
            <div style={{ display: "flex" }}>
                <div style={{ width: "100px", height: "80px", backgroundColor: "#f4f3ef", borderRadius: "20px", textAlign: "center", marginLeft: "10px" }}>
                    <i className="nc-icon nc-image" style={{ color: "black", fontSize: "30px", fontWeight: "100", paddingTop: "5px", paddingBottom: "10px" }} /><br />
                    Image
                </div>
                <div style={{ width: "100px", height: "80px", backgroundColor: "#f4f3ef", borderRadius: "20px", textAlign: "center", marginLeft: "10px" }}>
                    <i className="nc-icon nc-chat-33" style={{ color: "black", fontSize: "30px", fontWeight: "100", paddingTop: "5px", paddingBottom: "10px" }} /><br />
                    Message
                </div>
                <div style={{ width: "100px", height: "80px", backgroundColor: "#f4f3ef", borderRadius: "20px", textAlign: "center", marginLeft: "10px" }}>
                    <i className="nc-icon nc-single-copy-04" style={{ color: "black", fontSize: "30px", fontWeight: "100", paddingTop: "5px", paddingBottom: "10px" }} /><br />
                    Image Message
                </div>
                <div style={{ width: "100px", height: "80px", backgroundColor: "#f4f3ef", borderRadius: "20px", textAlign: "center", marginLeft: "10px" }}>
                    <i className="nc-icon nc-box" style={{ color: "black", fontSize: "30px", fontWeight: "100", paddingTop: "5px", paddingBottom: "10px" }} /><br />
                    Past posts
                </div>
                <div style={{ width: "100px", height: "80px", backgroundColor: "#f4f3ef", borderRadius: "20px", textAlign: "center", marginLeft: "10px" }}>
                    <i className="nc-icon nc-layout-11" style={{ color: "black", fontSize: "30px", fontWeight: "100", paddingTop: "5px", paddingBottom: "10px" }} /><br />
                    Profile message
                </div>
            </div>
        </div>
    )
}

export default ChatbotOption