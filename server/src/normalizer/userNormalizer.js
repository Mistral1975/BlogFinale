export default (user) => {
    const out = {
        email: user.email,
        displayName: user.displayName,
        _id: user._id
    }
    if(user.tokens) {
        out.accessToken = user.tokens.accessToken;
        out.refreshToken = user.tokens.refreshToken;
    }
    return out
}