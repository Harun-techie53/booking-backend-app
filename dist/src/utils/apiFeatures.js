"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    filter() {
        const queryObj = Object.assign({}, this.queryString);
        const excludedObj = ["page", "sort", "limit", "fields"];
        excludedObj.forEach((el) => delete queryObj[el]);
        let queryStrJSON = JSON.stringify(queryObj);
        //operators => gte, gt, lte, lt
        let queryStr = JSON.parse(queryStrJSON.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`));
        const { filter } = this.queryString;
        if (filter !== undefined && filter.city) {
            queryStr.city = filter.city;
        }
        if (filter !== undefined && filter.country) {
            queryStr.country = filter.country;
        }
        if (filter !== undefined && filter.adultCount) {
            queryStr.adultCount = filter.adultCount;
        }
        if (filter !== undefined && filter.childCount) {
            queryStr.childCount = filter.childCount;
        }
        if (filter !== undefined && filter.starRatings) {
            queryStr.starRating = {
                $in: filter.starRatings.map((rating) => parseInt(rating)),
            };
        }
        if (filter !== undefined && filter.hotelTypes) {
            queryStr.type = { $in: filter.hotelTypes };
        }
        if (filter !== undefined && filter.hotelFacilities) {
            queryStr.facilities = { $in: filter.hotelFacilities };
        }
        if (filter !== undefined && filter.maxPrice) {
            queryStr.pricePerNight = { $lt: filter.maxPrice };
        }
        delete queryStr["filter"];
        console.log("queryStr", queryStr);
        this.query.find(queryStr);
        return this;
    }
    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(",").join(" ");
            this.query.sort(sortBy);
        }
        else {
            this.query.sort("-created_At");
        }
        return this;
    }
    paginate() {
        const page = parseInt(this.queryString.page) * 1 || 1;
        const limit = parseInt(this.queryString.limit) * 1 || 100;
        const skip = (page - 1) * limit;
        this.query.skip(skip).limit(limit);
        return this;
    }
    fields() {
        if (this.queryString.fields) {
            const selectedFields = this.queryString.fields.split(",").join(" ");
            this.query.select(selectedFields);
        }
        else {
            this.query.select("-__v");
        }
        return this;
    }
    totalCountDocuments() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Clone the query to avoid modifying the original query
                const clonedQuery = this.query.model.find(Object.assign({}, this.query.getQuery()));
                // Count the documents
                const totalDocuments = yield clonedQuery.countDocuments();
                return totalDocuments;
            }
            catch (error) {
                throw new Error(`Error counting documents: ${error}`);
            }
        });
    }
}
exports.default = APIFeatures;
