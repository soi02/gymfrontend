import MarketUserProfileImage from "../../../components/test/example/MarketUserProfileImage";
import '../../../styles/MarketCommonStyles.css';

export default function MarketUserInfosOnUserPage({marketUserInfoElem1}) {
    
    return(
        <>
        
            <div className = "row" style = {{height : "14vh"}}>
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
                                        {marketUserInfoElem1.nickname}
                                    </div>
                                </div>
                                <div className = "row">
                                    <div className = "col" style = {{fontSize : "2vh"}}>
                                        #{marketUserInfoElem1.userId}
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