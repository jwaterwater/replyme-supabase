function returnJson(code:number,message:string,data?:any){
    return JSON.stringify({
        code,
        message,
        data
    })
}

export { returnJson }