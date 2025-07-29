import apiClient from "./apiClient";
import axios from "axios";

// 로그인 요청 함수
export async function loginRequestCustom( { accountName, password } ) {
    try {
        const response = await apiClient.post("/user/login", {
            accountName,
            password,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}
