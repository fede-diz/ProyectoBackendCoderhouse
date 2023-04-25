import EErrors from "../services/enums.js"

export default (error, req, res, next) => {
    req.logger.error(error.message);

    switch (error.code) {
        case EErrors.DUPLICATED_CODE_ERROR:
            res.status(400).json({status: 'error', error: error.name, cause: error.cause})
            break;

        case EErrors.ID_NOT_FOUND_ERROR:
            res.status(400).json({status: 'error', error: error.name, cause: error.cause})
            break;

        case EErrors.NOT_AUTH_TO_CREATE_ERROR:
            res.status(403).json({status: 'error', error: error.name, cause: error.cause})
            break;

        case EErrors.NOT_AUTH_TO_DELETE_ERROR:
            res.status(403).json({status: 'error', error: error.name, cause: error.cause})
            break;

        default:
            res.send({status: 'error', error: 'Unhandled error'})
            break;
    }
}