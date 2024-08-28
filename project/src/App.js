import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import ReadScreen from "./components/ReadScreen";
import pdfToText from "react-pdftotext";
import heroImg from "./heroImg.jpg";
import { MessageProvider } from './contexts/MessageContext';

function App() {
  const [submitPDF, setSubmitPDF] = useState(false);
  const [extractedText, setExtractedText] = useState(
    "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure? At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat."
  );

  const hiddenFileInput = useRef(null);
  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    pdfToText(file)
      .then((text) => setExtractedText(text))
      .catch((error) => console.error("Failed to extract text from pdf"));
    setSubmitPDF(true);
  };

  useEffect(() => {}, [submitPDF]);

  return (
    <MessageProvider>
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        height: "97vh",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {submitPDF ? (
        <ReadScreen extractedText={extractedText}/>
      ) : (
        <>
          <div
            style={{
              height: "100%",
              width: "50%",
              backgroundImage: `url(${heroImg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
          </div>
          <div
            style={{
              display: "grid",
              height: "100%",
              padding: "1rem",
              width: "50%",
              placeItems: "center",
            }}
          >
            <div className="card-body">
              <h1
                style={{
                  fontSize: "170px",
                  fontFamily: "sans-serif",
                  color: "#ff007f",
                  margin: "0px",
                }}
              >
                InsightAI
              </h1>
              <h1 style={{fontSize:"70px", fontFamily: "sans-serif", marginTop: "20px"}}>
                let's read --{">"}{" "}
                <button
                  className="button-upload"
                  style={{
                    color: "white",
                    background: "linear-gradient(to right, #ff007f, #ffafbd)",
                    fontSize: "50px",
                    borderRadius: "5px",
                    padding: "10px",
                    fontWeight: "bold",
                    border: "0px",
                  }}
                  onClick={handleClick}
                >
                  Upload a file
                </button>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  ref={hiddenFileInput}
                  style={{ display: "none" }} // Make the file input element invisible
                />
              </h1>
            </div>
          </div>
        </>
      )}
    </div>
    </MessageProvider>
  );
}

export default App;
