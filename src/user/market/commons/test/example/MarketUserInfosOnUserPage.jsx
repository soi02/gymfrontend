import MarketUserProfileImage from "../../component/MarketUserProfileImage";

export default function MarketUserInfosOnUserPage() {
    
    return(
        <>
        
            <div className = "row" style = {{height : "15vh"}}>
                <div className = "widthDefault">
                    <div className = "col">
                        <div className = "row">
                            <div className = "col-auto" style = {{width : "10vh", height : "10vh", overflow : "hidden", position : "relative",
                                marginLeft : "3vh", marginRight : "1.5vh"}}>
                                <MarketUserProfileImage />
                            </div>
                            <div className = "col" style = {{display : "flex", flexDirection : "column", justifyContent : "center"}}>
                                <div className = "row">
                                    <div className = "col" style = {{fontSize : "3vh", fontWeight : "bold"}}>
                                        GoodDevil
                                    </div>
                                </div>
                                <div className = "row">
                                    <div className = "col" style = {{fontSize : "2vh"}}>
                                        #1004
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        
        </>
    )
    
}