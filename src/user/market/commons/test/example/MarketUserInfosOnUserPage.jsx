import MarketUserProfileImage from "../../../components/test/example/MarketUserProfileImage";
import '../../../styles/MarketCommonStyles.css';

export default function MarketUserInfosOnUserPage({marketUserInfoElem1}) {
    
    return(
        <>
        
            <div className = "row" style = {{height : "4.6125rem", marginTop : "0.5rem", marginBottom : "0.5rem"}}>
                <div className = "widthDefault">
                    <div className = "col">
                        <div className = "row">
                            <div className = "col-auto" style = {{fontSize : "3.25rem", width : "4rem", height : "4rem", overflow : "hidden", position : "relative",
                                marginLeft : "1.25rem", marginRight : "0.25rem", display : "flex", justifyContent : "center", alignItems : "center"}}>
                                <i className="bi bi-person-circle"></i>
                                {/* <MarketUserProfileImage /> */}
                            </div>
                            <div className = "col" style = {{display : "flex", flexDirection : "column", justifyContent : "center"}}>
                                <div className = "row">
                                    <div className = "col" style = {{fontSize : "1.25rem", fontWeight : "bold"}}>
                                        {marketUserInfoElem1.nickname}
                                    </div>
                                </div>
                                <div className = "row">
                                    <div className = "col" style = {{fontSize : "0.8125rem"}}>
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