import axios from 'axios';

export const sendInvitation = async (data) => {
    const response = await axios.post(`http://${process.env.BASE_URL}/invites/invite`, data);
    return response.data;
};