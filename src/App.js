import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";


const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
@media (min-width: 320px) {
  border: 3px solid;
  border-color: #00d1f6;
  background-color: var(--secondary);
  padding: 0px;
  font-weight: bold;
  color: var(--secondary-text-btn);
  width: 100px;
  cursor: pointer;
  font-family: pressstart2p;
  font-size: 22px;
  fill: #f5c314;
  opacity: 1;
  margin: 14px;
  text-shadow: -5px 4px #000;
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
}
  border: 2px solid;
  border-color: #00d1f6;
  background-color: var(--secondary);
  padding: 6px;
  font-weight: bold;
  color: var(--secondary-text-btn);
  width: 100px;
  cursor: pointer;
  font-family: fantasy;
  font-size: 30px;
  fill: #f5c314;
  opacity: 1;
  margin: 14px;
  text-shadow: -5px 4px #000;
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`; 

export const StyledRoundButton = styled.button`
  padding: 10px; 
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 15px;
  font-weight: bold;
  font-size: 24px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  text-shadow: -4px 3px #000;
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 50%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  @media (min-width: 767px) {
  }
  transition: width 0.5s;
  transition: height 0.5s;
  width: 143px;
    height: 10px;
    margin-top: 0px;
    border: 1px solid rgb(99, 133, 150);
    box-shadow: 3px -10px inset #000;
    margin: 0 58px 0 0;
`;

export const StyledLogob = styled.img`
  @media (min-width: 767px) {
  }
  transition: width 0.5s;
  transition: height 0.5s;
  width: 143px;
    height: 10px;
    margin-top: 0px;
    border: 1px solid rgb(99, 133, 150);
    box-shadow: 3px -10px inset #000;
`;

export const StyledBar = styled.img`
  @media (min-width: 767px) {
  }
  transition: width 0.5s;
  transition: height 0.5s;
  width: 1922px;
  height: 60px;
  margin-top: 0px;
  border-top: 2px solid #2a11d4;
  box-shadow: rgb(0 0 0) 3px -10px inset;
  margin-bottom: -66px;
`;


export const StyledImg = styled.img` 
//  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
//  border: 4px dashed var(--secondary);
//   background-color: var(--accent);
//   border-radius: 100%;
//   width: 200px;
//   @media (min-width: 900px) {
//    width: 250px;
//   }
//   @media (min-width: 1000px) {
//   width: 300px;
//   }
//   transition: width 0.5s;
  margin-left: -91%;
  padding-top: 29px;
  padding-bottom: 5px;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState();
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: true,
  });

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(blockchain.account, mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 5) {
      newMintAmount = 5;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen>
      <s.Container
        flex={1}
        ai={"center"}

        style={{ padding: 0, backgroundColor: "var(--primary)", min-height: "100", min-width: "24", width: "100", height: "auto", position: "fixed", top: 0, left: 0}}
        image={CONFIG.SHOW_BACKGROUND ? "/config/images/bg3.jpg" : null}
      >

        <s.TextDescription
            style={{
              textAlign: "center",
              color: "#dad748",
              fontFamily: "var(--accent-font-family)",
              opacity: "1",
              margin: "0 76px 0 0"     
            }}
          >
           CONNECTED
          </s.TextDescription>

          <StyledLogo alt={"redbar"} src={"/config/images/redbar.png"} />

        <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
          </s.TextDescription>
        <s.SpacerSmall />
        <ResponsiveWrapper flex={1} style={{ padding: 0 }} test>
          <s.Container flex={1} jc={"center"} ai={"center"}>
            <s.Container flex={1} jc={"center"} ai={"center"}>         
          </s.Container>
          </s.Container>
          <s.SpacerLarge />
          <s.Container
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{
              backgroundColor: "var(--accent)",
              border: "10px solid #048392",
              boxShadow: "inset 0px 0px 0px 10px #226a7d",
              height: "535px",
              width: "235px",
              marginLeft: "-45px"
            }}
          >
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 50,
                fontWeight: "bold",
                color: "var(--accent-text)",
                fontFamily: "impact",
                marginTop: "36px",
                
              }}
            >
              {data.totalSupply} / {CONFIG.MAX_SUPPLY}
            </s.TextTitle>
            {/* <s.TextDescription
              style={{
                textAlign: "center",
                color: "var(--primary-text)",
              }}
            >
              <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK}>
                {truncate(CONFIG.CONTRACT_ADDRESS, 15)}
              </StyledLink>
            </s.TextDescription> */}
            <span
              style={{
                textAlign: "center",
              }}
            >
              {/* <StyledButton
                onClick={(e) => {
                  window.open("/config/roadmap.pdf", "_blank");
                }}
                style={{
                  margin: "5px",
                }}
              >
                Roadmap
              </StyledButton> */}
              {/* <StyledButton
                style={{
                  margin: "5px",
                }}
                onClick={(e) => {
                  window.open(CONFIG.MARKETPLACE_LINK, "_blank");
                }}
              >
                {CONFIG.MARKETPLACE}
              </StyledButton> */}
            </span>
            <s.SpacerSmall />
            {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  The sale has ended.
                </s.TextTitle>
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)", fontFamily: "var(--accent-font-family)" }}
                >
                  You can still find {CONFIG.NFT_NAME} on
                </s.TextDescription>
                <s.SpacerSmall />
                <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                  {CONFIG.MARKETPLACE}
                </StyledLink>
              </>
            ) : (
              <>
                <s.SpacerXSmall />
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)", fontSize: "18px", fontFamily: "impact" }}
                >
                  .01 ETH
                </s.TextDescription>
                <s.SpacerSmall />
                {blockchain.account === "" ||
                  blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    
                    <s.SpacerSmall />
                    
                    <StyledLogob alt={"redbar"} src={"/config/images/Bar.png"} />
                    
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >
                      MINT
                    </StyledButton>
  
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                     
                    </s.TextDescription>
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                    
                       <StyledLogo alt={"redbar"} src={"/config/images/Bar.png"} />
                      
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      {feedback}
                    </s.TextDescription>

                    <StyledLogo alt={"redbar"} src={"/config/images/Bar.png"} />

                    <s.SpacerMedium />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledRoundButton
                        style={{ lineHeight: 0.4 }}
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          decrementMintAmount();
                        }}
                      >
                        -
                      </StyledRoundButton>
                      <s.SpacerMedium />
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text-num)",
                          textShadow: "-3px 3px #000",
                          fontSize: "20px",
                          fontFamily: 'cursive',
                          opacity: "1",                 
                        }}
                      >
                        {mintAmount}
                      </s.TextDescription>
                      <s.SpacerMedium />
                      <StyledRoundButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          incrementMintAmount();
                        }}
                      >
                        +
                      </StyledRoundButton>
                    </s.Container>
                    <s.SpacerSmall />
                    { <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          claimNFTs();
                          getData();
                        }}
                      >
                        {claimingNft ? "MINT" : "MINT"}
                      </StyledButton>
                    </s.Container> }
                  </>
                )}
              </>
            )}
            <s.SpacerMedium />
          </s.Container>
          <s.SpacerLarge />
          <s.Container flex={1} jc={"center"} ai={"center"}>
            <StyledImg
//               alt={"example"}
//               src={"/config/images/example.gif"}
//               style={{ transform: "scaleX(-1)" }}
            />
          </s.Container>
        </ResponsiveWrapper>
        <s.SpacerMedium />
            
        <s.Container jc={"center"} ai={"center"} style={{ width: "103%" }}>
          <StyledBar alt={"redbar"} src={"/config/images/Basebar.png"} />
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
              
            }}
          >
            
          </s.TextDescription>
          <s.SpacerSmall />
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
            
            2022 - NOT AFFLIATED WITH NBA JAM OR ANY OTHER NFT PROJECT
          </s.TextDescription>
        </s.Container>
      </s.Container>
    </s.Screen>
  );
}
export default App;
