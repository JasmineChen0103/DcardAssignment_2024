# 專案概述

這個專案是為了申請 Dcard 2024 前端實習生職位而寫的範例作業。以下是作業要求：
[2024 Frontend Intern Homework](https://drive.google.com/file/d/1TYiTdtrtISkT25AULbycKipaX8yveBmN/view?usp=sharing)

# 如何啟動專案

以下是啟動專案的步驟：

1. 克隆此存儲庫到本地機器：

    ```
    git clone https://github.com/your_username/project_name.git
    ```

2. 進入專案目錄：

    ```
    cd project_name
    ```

3. 安裝相關依賴：

    ```
    npm install
    ```

4. 啟動專案：

    ```
    npm start
    ```

# 作業架構設計

在這個專案中，構建了一個 React 應用程式，該應用程式具有以下結構：

- `assets` 資料夾：包含了圖片檔案 `github-logo.png`。
- `components` 資料夾：包含了一系列 CSS 樣式文件以及用於不同功能模塊的 React 組件。
  - `EditPost.css`
  - `NewPost.css`
  - `Post.css`
  - `PostList.css`
  - `Navbar.css`
- `pages` 資料夾：包含了應用程式的主要頁面，每個頁面對應於應用程式的不同功能。
  - `PostList.js`
  - `Post.js`
  - `NewPost.js`
  - `EditPost.js`
- `App.js`：React 應用程式的主要入口點，定義了應用程式的整體結構和路由設置。
- `index.js`：React 應用程式的渲染入口點。

此外，還包含了一個 `server.js` 文件，用於設置後端服務。這個後端服務提供了與 GitHub API 的交互功能，用於處理 OAuth 認證、獲取用戶數據以及創建和更新 GitHub Issue。

# 在本地端操作作業的螢幕錄影

以下是在本地端的操作螢幕錄影：
(前情提要：創建丹尼爾的 Github帳號 -> DannierForDcard / 設有8個repository，且各有3個issue)

### 作業要求1. 
**列表頁第一次只能載十筆，每當列表滾到底部時自動發送api請求，並載入額外10筆，直到沒有更多文章。**
   [影片連結](https://drive.google.com/file/d/1KXofeQOaGqz5qMc4NmtZl_S_eWc8X9M9/view?usp=sharing)

### 作業要求2. 
**非作者僅能「瀏覽」Blog文章、「瀏覽」留言**
   [影片連結](https://drive.google.com/file/d/1pvJ82TfKU3tmV4lMIU0MNUHRsViIlPEb/view?usp=sharing)

### 作業要求3. 
**作者登入後能「瀏覽」、「新英」、「更新」Blog文章、「瀏覽」留言**
   [影片連結](https://drive.google.com/file/d/101M_1cE0EttV-EtHhdK_tElragE3ofmK/view?usp=sharing)


