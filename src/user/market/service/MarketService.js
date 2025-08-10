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
            {
                headers : {
                    "Content-Type": "application/json"
                }
            }
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
    
    const postUpdateMarketArticle = async(payload) => {
        const id = payload.id;
        const response = await axios.post(`${constMarketAPIBasedURL}/updateMarketArticle/${id}`,
            payload,
            {
                headers : {
                    "Content-Type": "application/json"
                }
            }
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
    
    const getSelectMarketCommentOnArticle = async(articleId) =>{
        const response = await axios.get(`${constMarketAPIBasedURL}/selectMarketCommentOnArticle`, {
            params : {articleId}
        });
        return response.data;
    }
    
    const postUpdateMarketCommentOnArticle = async(payload) => {
        const id = payload.id;
        const response = await axios.post(`${constMarketAPIBasedURL}/updateMarketCommentOnArticle/${id}`,
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
    
    const postDeleteMarketProductInterestedLog = async(specificArticleId) => {
        const response = await axios.post(`${constMarketAPIBasedURL}/deleteMarketProductInterestedLog`,
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
    
    const getSelectMarketProductInterestedLogWhenUserInfo = async(marketUserId) =>{
        const response = await axios.get(`${constMarketAPIBasedURL}/selectMarketProductInterestedLogWhenUserInfo`, {
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
    
    const getSelectMarketDealedLogWhenBuyer = async(buyerId) =>{
        const response = await axios.get(`${constMarketAPIBasedURL}/selectMarketDealedLogWhenBuyer/${buyerId}`);
        return response.data;
    }
    
    const getSelectMarketDealedLogWhenSeller = async(sellerId) =>{
        const response = await axios.get(`${constMarketAPIBasedURL}/selectMarketDealedLogWhenSeller/${sellerId}`);
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
    
    return {
        getSelectMarketUserInfo, postInsertMarketArticle, getSelectMarketArticle, getSelectSpecificMarketArticle, postUpdateMarketArticle, postDeleteMarketArticle, 
        postInsertMarketCommentOnArticle, getSelectMarketCommentOnArticle, postUpdateMarketCommentOnArticle, postDeleteMarketCommentOnArticle, 
        postInsertMarketProductInterestedLog, postDeleteMarketProductInterestedLog, 
        getSelectMarketProductInterestedLogWhenUserInfo, getSelectMarketProductInterestedLogWhenArticleInfo, getSelectMarketProductInterestedLogWhenUserAndArticleInfo,
        postInsertMarketDealedLog, getSelectMarketDealedLogWhenBuyer, getSelectMarketDealedLogWhenSeller, 
        postInsertMarketReviewToUser, getSelectMarketReviewToUser, postUpdateMarketReviewToUser, postDeleteMarketReviewToUser
    };
    
}