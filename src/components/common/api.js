import axios from "axios";

const a = "1n_g3NMkDe-AXqDKhYNxT-Es_buHtt_0bzdtjV3V694"
const b = "PYH-KKqV-vfTeVse-ZSR-H6gSVDG17mvU38jYBlY6OU"
const c = "HcoMD59__BKsEa9bdSV6D2ivqj96crvRuKZqkJ5pqO4"

export const api = axios.create({
    baseURL: "https://api.unsplash.com",
    headers: {
        'Content-Type': 'application/json',
        'X-Custom-Header-Example': 'example',
    },
});

export const headers = {
    Authorization: `Client-ID ${a}`,
}


