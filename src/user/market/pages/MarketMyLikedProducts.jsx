export default function MarketMyLikedProductsPage() {
    
    return(
        <>

            <div className = "row">
                <div className = "col" style = {{paddingLeft : "3vh", paddingRight : "3vh", marginBottom : "4.5vh"}}>
                    <div className = "row">
                        <div className = "col" style = {{fontSize : "1.875vh"}}>
                            내가 탐낸 물품 개수
                        </div>
                    </div>
                    <div className = "row">
                        <div className = "col" style = {{fontSize : "3.25vh", fontWeight : "bold"}}>
                            4 개
                        </div>
                    </div>
                    <div className = "row">
                        <div className = "col secondaryDivisionDefault" style = {{marginTop : "0.5vh", paddingTop : "2vh", paddingBottom : "0.5vh", paddingLeft : "2vh", paddingRight : "2vh"}}>
                            <div className = "row">
                                <div className = "col" style = {{paddingLeft : "2vh", paddingRight : "2vh"}}>
                                    {/*
                                        constmarketuserSoldProductElementList.length  > 0 ? constmarketuserSoldProductElementList : <></>
                                        * 해당 const 리스트의 제일 왼쪽에 하트 활성화, 비활성화로 물품의 탐냄 상태를 반영함. (새로고침 시 하트를 비활성화한 물품 상세 글은, 내가 탐낸 물품 목록에서 사라짐)
                                    */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className = "row">
                <div className = "col">
                    탐낸 물품 취소 방법 설명
                </div>
            </div>

        </>
    )
    
}