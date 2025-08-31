import axios from "axios";

export default function useMarketAPI() {
    
    const constMarketAPIBasedURL = "http://localhost:8080/api/market"
    
    const getSelectMarketUserInfo = async(userId) =>{
        const response = await axios.get(`${constMarketAPIBasedURL}/selectMarketUserInfo`, {
            params : {userId}
        });
        return response.data;
    }
    
    const postInsertMarketArticle = async(payload) => {
        const response = await axios.post(`${constMarketAPIBasedURL}/insertMarketArticle`,
            payload,
            // {
            //     headers : {
            //         "Content-Type": "multipart/form-data"
            //     }
            // }
        )
        return response.data;
    }
    
    const getSelectMarketArticle = async() => {
        const response = await axios.get(`${constMarketAPIBasedURL}/selectMarketArticle`);
        return response.data;
    }
    
    const getSelectSpecificMarketArticle = async(id) =>{
        const response = await axios.get(`${constMarketAPIBasedURL}/selectSpecificMarketArticle`, {
            params : {id}
        });
        return response.data;
    }
    
    const getSelectSpecificMarketArticleInfo = async(id) =>{
        const response = await axios.get(`${constMarketAPIBasedURL}/selectSpecificMarketArticleInfo`, {
            params : {id}
        });
        return response.data;
    }
    
    const postUpdateMarketArticle = async(payload) => {
        const response = await axios.post(`${constMarketAPIBasedURL}/updateMarketArticle`,
            payload,
            // {
            //     headers : {
            //         "Content-Type": "application/json"
            //     }
            // }
        )
        return response.data;
    }
    
    const postDeleteMarketArticle = async(id) => {
        const response = await axios.post(`${constMarketAPIBasedURL}/deleteMarketArticle`, 
            {  } ,
            {            
                params : {id},
                headers : {
                    "Content-Type": "application/json"
                }
            }
        )
        return response.data;
    }
    
    const postInsertMarketCommentOnArticle = async(payload) => {
        const response = await axios.post(`${constMarketAPIBasedURL}/insertMarketCommentOnArticle`,
            payload,
            {
                headers : {
                    "Content-Type": "application/json"
                }
            }
        )
        return response.data;
    }
    
    const getSelectMarketCommentOnArticle = async(articleId) => {
        const response = await axios.get(`${constMarketAPIBasedURL}/selectMarketCommentOnArticle`, {
            params : {articleId}
        });
        return response.data;
    }
    const getSelectCountMarketCommentOnArticle = async(articleId) => {
        const response = await axios.get(`${constMarketAPIBasedURL}/selectCountMarketCommentOnArticle`, {
            params : {articleId}
        });
        return response.data;
    }
    const getSelectSpecificMarketCommentOnArticle = async(id) => {
        const response = await axios.get(`${constMarketAPIBasedURL}/selectSpecificMarketCommentOnArticle`, {
            params : {id}
        });
        return response.data;
    }
        
    const postUpdateMarketCommentOnArticle = async(payload) => {
        const response = await axios.post(`${constMarketAPIBasedURL}/updateMarketCommentOnArticle`,
            payload,
            {
                headers : {
                    "Content-Type": "application/json"
                }
            }
        )
        return response.data;
    }
    
    const postDeleteMarketCommentOnArticle = async(id) => {
        const response = await axios.post(`${constMarketAPIBasedURL}/deleteMarketCommentOnArticle`,
            {  } ,
            {            
                params : {id},
                headers : {
                    "Content-Type": "application/json"
                }
            }
        )
        return response.data;
    }
    
    const postInsertMarketProductInterestedLog = async(payload) => {
        const response = await axios.post(`${constMarketAPIBasedURL}/insertMarketProductInterestedLog`,
            payload,
            {
                headers : {
                    "Content-Type": "application/json"
                }
            }
        )
        return response.data;
    }
    
    const postDeleteMarketProductInterestedLog = async(marketUserId, specificArticleId) => {
        const response = await axios.post(`${constMarketAPIBasedURL}/deleteMarketProductInterestedLog`,
            {  } ,
            {            
                params : {marketUserId, specificArticleId},
                headers : {
                    "Content-Type": "application/json"
                }
            }
        )
        return response.data;
    }
    
    const getSelectMarketProductInterestedLogWhenUserInfo = async(marketUserId) =>{
        const response = await axios.get(`${constMarketAPIBasedURL}/selectMarketProductInterestedLogWhenUserInfo`, {
            params : {marketUserId}
        });
        return response.data;
    }
    const getSelectCountMarketProductInterestedLogWhenUserInfo = async(marketUserId) =>{
        const response = await axios.get(`${constMarketAPIBasedURL}/selectCountMarketProductInterestedLogWhenUserInfo`, {
            params : {marketUserId}
        });
        return response.data;
    }
    
    const getSelectMarketProductInterestedLogWhenArticleInfo = async(specificArticleId) =>{
        const response = await axios.get(`${constMarketAPIBasedURL}/selectMarketProductInterestedLogWhenArticleInfo`, {
            params : {specificArticleId}
        });
        return response.data;
    }
    const getSelectCountMarketProductInterestedLogWhenArticleInfo = async(specificArticleId) =>{
        const response = await axios.get(`${constMarketAPIBasedURL}/selectCountMarketProductInterestedLogWhenArticleInfo`, {
            params : {specificArticleId}
        });
        return response.data;
    }
    
    const getSelectMarketProductInterestedLogWhenUserAndArticleInfo = async(marketUserId, specificArticleId) =>{
        const response = await axios.get(`${constMarketAPIBasedURL}/selectMarketProductInterestedLogWhenUserAndArticleInfo`, {
            params : {marketUserId, specificArticleId}
        });
        return response.data;
    }
    
    const postInsertMarketDealedLog = async(payload) => {
        const response = await axios.post(`${constMarketAPIBasedURL}/insertMarketDealedLog`,
            payload,
            {
                headers : {
                    "Content-Type": "application/json"
                }
            }
        )
        return response.data;
    }
    
    const postInsertMarketDealedLogCheckedBySeller = async(payload) => {
        const response = await axios.post(`${constMarketAPIBasedURL}/insertMarketDealedLogCheckedBySeller`,
            payload,
            {
                headers : {
                    "Content-Type": "application/json"
                }
            }
        )
        return response.data;
    }
    const getSelectSpecificMarketDealedLogCheckedBySeller = async(sellerId, specificArticleId) =>{
        const response = await axios.get(`${constMarketAPIBasedURL}/selectSpecificMarketDealedLogCheckedBySeller`, {
            params : {sellerId, specificArticleId}
        });
        return response.data;
    }
    const postDeleteMarketDealedLogCheckedBySeller = async(specificArticleId) => {
        const response = await axios.post(`${constMarketAPIBasedURL}/deleteMarketCommentOnArticle`,
            {  } ,
            {            
                params : {specificArticleId},
                headers : {
                    "Content-Type": "application/json"
                }
            }
        )
        return response.data;
    }
    const postInsertMarketDealedLogCheckedByBuyer = async(payload) => {
        const response = await axios.post(`${constMarketAPIBasedURL}/insertMarketDealedLogCheckedByBuyer`,
            payload,
            {
                headers : {
                    "Content-Type": "application/json"
                }
            }
        )
        return response.data;
    }
    const getSelectSpecificMarketDealedLogCheckedByBuyer = async(buyerId, specificArticleId) =>{
        const response = await axios.get(`${constMarketAPIBasedURL}/selectSpecificMarketDealedLogCheckedByBuyer`, {
            params : {buyerId, specificArticleId}
        });
        return response.data;
    }
    const postDeleteMarketDealedLogCheckedByBuyer = async(specificArticleId) => {
        const response = await axios.post(`${constMarketAPIBasedURL}/deleteMarketCommentOnArticle`,
            {  } ,
            {            
                params : {specificArticleId},
                headers : {
                    "Content-Type": "application/json"
                }
            }
        )
        return response.data;
    }
    
    const getSelectSpecificMarketDealedLog = async(specificArticleId) =>{
        const response = await axios.get(`${constMarketAPIBasedURL}/selectSpecificMarketDealedLog`, {
            params : {specificArticleId}
        });
        return response.data;
    }
    
    const postUpdateMarketArticleToSellEnded = async(id) =>{
        const response = await axios.post(`${constMarketAPIBasedURL}/updateMarketArticleToSellEnded`, 
            {  } ,
            {            
                params : {id},
                headers : {
                    "Content-Type": "application/json"
                }
            }
        )
        return response.data;
    }  
    
    
    // const postDeleteMarketArticle = async(id) => {
    //     const response = await axios.post(`${constMarketAPIBasedURL}/deleteMarketArticle`, 
    //         {  } ,
    //         {            
    //             params : {id},
    //             headers : {
    //                 "Content-Type": "application/json"
    //             }
    //         }
    //     )
    //     return response.data;
    // }
    
    
    const getSelectMarketDealedLogWhenBuyer = async(buyerId) =>{
        const response = await axios.get(`${constMarketAPIBasedURL}/selectMarketDealedLogWhenBuyer`, {
            params : {buyerId}
        });
        return response.data;
    }
    const getSelectCountMarketDealedLogWhenBuyer = async(buyerId) =>{
        const response = await axios.get(`${constMarketAPIBasedURL}/selectCountMarketDealedLogWhenBuyer`, {
            params : {buyerId}
        });
        return response.data;
    }
    
    const getSelectMarketDealedLogWhenSeller = async(sellerId) =>{
        const response = await axios.get(`${constMarketAPIBasedURL}/selectMarketDealedLogWhenSeller`, {
            params : {sellerId}
        });
        return response.data;
    }
    const getSelectCountMarketUndealedLogWhenSeller = async(marketUserId) =>{
        const response = await axios.get(`${constMarketAPIBasedURL}/selectCountMarketUndealedLogWhenSeller`, {
            params : {marketUserId}
        });
        return response.data;
    }
    const getSelectCountMarketDealedLogWhenSeller = async(sellerId) =>{
        const response = await axios.get(`${constMarketAPIBasedURL}/selectCountMarketDealedLogWhenSeller`, {
            params : {sellerId}
        });
        return response.data;
    }
    
    const postInsertMarketReviewToUser = async(payload) => {
        const response = await axios.post(`${constMarketAPIBasedURL}/insertMarketReviewToUser`,
            payload,
            {
                headers : {
                    "Content-Type": "application/json"
                }
            }
        )
        return response.data;
    }
    
    const getSelectMarketReviewToUser = async(evaluatedUserId) =>{
        const response = await axios.get(`${constMarketAPIBasedURL}/selectMarketReviewToUser/${evaluatedUserId}`);
        return response.data;
    }
    
    const postUpdateMarketReviewToUser = async(payload) => {
        const id = payload.id;
        const response = await axios.post(`${constMarketAPIBasedURL}/updateMarketReviewToUser/${id}`,
            payload,
            {
                headers : {
                    "Content-Type": "application/json"
                }
            }
        )
        return response.data;
    }
    
    const postDeleteMarketReviewToUser = async(evaluatedUserId) => {
        const response = await axios.post(`${constMarketAPIBasedURL}/deleteMarketReviewToUser/${evaluatedUserId}`,
            { evaluatedUserId } ,
            {
                headers : {
                    "Content-Type": "application/json"
                }
            }
        )
        return response.data;
    }
    
    const selectMarketArticleBySearchWord = async(searchWord) => {
        
        const response = await axios.get(`${constMarketAPIBasedURL}/selectMarketArticleBySearchWord`, {
            params : {searchWord}
        });
        return response.data;
        
    }
    
    return {
        getSelectMarketUserInfo, postInsertMarketArticle, getSelectMarketArticle, getSelectSpecificMarketArticle, getSelectSpecificMarketArticleInfo, 
        postUpdateMarketArticle, postDeleteMarketArticle, postInsertMarketCommentOnArticle, 
        getSelectMarketCommentOnArticle, getSelectCountMarketCommentOnArticle, getSelectSpecificMarketCommentOnArticle, 
        postUpdateMarketCommentOnArticle, postDeleteMarketCommentOnArticle, 
        postInsertMarketProductInterestedLog, postDeleteMarketProductInterestedLog, 
        getSelectMarketProductInterestedLogWhenUserInfo, getSelectCountMarketProductInterestedLogWhenUserInfo, 
        getSelectMarketProductInterestedLogWhenArticleInfo, getSelectCountMarketProductInterestedLogWhenArticleInfo,
        getSelectMarketProductInterestedLogWhenUserAndArticleInfo, 
        postInsertMarketDealedLog, getSelectSpecificMarketDealedLog, postUpdateMarketArticleToSellEnded,
        postInsertMarketDealedLogCheckedBySeller, getSelectSpecificMarketDealedLogCheckedBySeller, postDeleteMarketDealedLogCheckedBySeller,
        postInsertMarketDealedLogCheckedByBuyer, getSelectSpecificMarketDealedLogCheckedByBuyer, postDeleteMarketDealedLogCheckedByBuyer,
        getSelectMarketDealedLogWhenBuyer, getSelectCountMarketDealedLogWhenBuyer,
        getSelectMarketDealedLogWhenSeller, getSelectCountMarketUndealedLogWhenSeller, getSelectCountMarketDealedLogWhenSeller,
        postInsertMarketReviewToUser, getSelectMarketReviewToUser, postUpdateMarketReviewToUser, postDeleteMarketReviewToUser,
        selectMarketArticleBySearchWord
    };
    
}