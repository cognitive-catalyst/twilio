import json
import pprint

import requests

# Constants
# dashboard_url = 'http://twilio_demo.mybluemix.net/sms'
dashboard_url = 'http://localhost:8888/api/message'

msgs_to_send = 10  # if greater than msgs_defined will loop over messaged defined
msgs_defined = 3
null = None
pp = pprint.PrettyPrinter(indent=4)


def get_test_sms_addon(indx):
    if (indx == 0):
        #sms_addon =   "zero"
        sms_addon = {
            "status": "successful",
            "message": null,
            "code": null,
            "results": {
                "ibm_watson_insights": {
                    "request_sid": "XRadac2306daad21d7c157113ba4e4e0b2",
                    "status": "successful",
                    "message": null,
                    "code": null,
                    "result": {
                        "status": "OK",
                        "usage": "Terms of Use: http://www.alchemyapi.com/company/terms.html",
                        "totalTransactions": "5",
                        "language": "english",
                        "keywords":
                        [{
                            "text": "Dude joker",
                            "relevance": "0.936968",
                            "sentiment": {
                                  "type": "negative",
                                  "score": "-0.281815"
                            }
                        }
                        ],
                        "concepts":
                        [
                        ],
                        "entities":
                        [
                        ]
                    }
                },
                "ibm_watson_sentiment": {
                    "request_sid": "XRfcfd2c0261f5d1f353a8eb81845e008a",
                    "status": "successful",
                    "message": null,
                    "code": null,
                    "result": {
                        "status": "OK",
                        "usage": "Terms of Use: http://www.alchemyapi.com/company/terms.html",
                        "totalTransactions": "1",
                        "language": "english",
                        "docSentiment": {
                            "score": "-0.281815",
                            "type": "negative"
                        }
                    }
                }
            }
        }
    elif (indx == 1):
        # sms_addon =   "one"
        sms_addon = {
            "status": "successful",
            "message": null,
            "code": null,
            "results": {
                "ibm_watson_insights": {
                    "request_sid": "XRadac2306daad21d7c157113ba4e4e0b2",
                    "status": "successful",
                    "message": null,
                    "code": null,
                    "result": {
                        "status": "OK",
                        "usage": "Terms of Use: http://www.alchemyapi.com/company/terms.html",
                        "totalTransactions": "5",
                        "language": "english",
                        "keywords":
                        [{
                            "text": "hot potato",
                            "relevance": "0.134",
                            "sentiment": {
                                  "type": "negative",
                                  "score": "-0.83"
                            }
                        },
                            {
                            "text": "food",
                            "relevance": "0.793234",
                            "sentiment": {
                                "type": "positive",
                                "score": "0.42"
                            }
                        }
                        ],
                        "concepts":
                        [{
                            "text": "Kitchen",
                            "relevance": "0.8402"
                        }
                        ],
                        "entities":
                        [
                        ]
                    }
                },
                "ibm_watson_sentiment": {
                    "request_sid": "XRfcfd2c0261f5d1f353a8eb81845e008a",
                    "status": "successful",
                    "message": null,
                    "code": null,
                    "result": {
                        "status": "OK",
                        "usage": "Terms of Use: http://www.alchemyapi.com/company/terms.html",
                        "totalTransactions": "1",
                        "language": "english",
                        "docSentiment": {
                            "score": "0.31815",
                            "type": "positive"
                        }
                    }
                }
            }
        }
    elif (indx == 2):
        # sms_addon =   "two"
        sms_addon = {
            "status": "successful",
            "message": null,
            "code": null,
            "results": {
                "ibm_watson_insights": {
                    "request_sid": "XRadac2306daad21d7c157113ba4e4e0b2",
                    "status": "successful",
                    "message": null,
                    "code": null,
                    "result": {
                        "status": "OK",
                        "usage": "Terms of Use: http://www.alchemyapi.com/company/terms.html",
                        "totalTransactions": "5",
                        "language": "english",
                        "keywords":
                        [{
                            "text": "hot potato",
                            "relevance": "0.234",
                            "sentiment": {
                                  "type": "negative",
                                  "score": "-0.83"
                            }
                        },
                            {
                            "text": "food",
                            "relevance": "0.793234",
                            "sentiment": {
                                "type": "positive",
                                "score": "0.42"
                            }
                        }
                        ],
                        "concepts":
                        [{
                            "text": "Kitchen",
                            "relevance": "0.8402"
                        }
                        ],
                        "entities":
                        [{
                            "text": "food",
                            "type": "noun",
                            "relevance": "0.93234",
                            "count": "3",
                            "sentiment": {
                                "type": "positive",
                                "score": "0.42"
                            }
                        },
                            {
                            "text": "groceries",
                            "type": "noun",
                            "relevance": "0.33234",
                            "count": "1",
                            "sentiment": {
                                "type": "positive",
                                "score": "0.02"
                            }
                        }
                        ]
                    }
                },
                "ibm_watson_sentiment": {
                    "request_sid": "XRfcfd2c0261f5d1f353a8eb81845e008a",
                    "status": "successful",
                    "message": null,
                    "code": null,
                    "result": {
                        "status": "OK",
                        "usage": "Terms of Use: http://www.alchemyapi.com/company/terms.html",
                        "totalTransactions": "1",
                        "language": "english",
                        "docSentiment": {
                            "score": "0.815",
                            "type": "positive"
                        }
                    }
                }
            }
        }
    else:
        sms_addon = None

    return sms_addon


def main():

    for indx in range(0, msgs_to_send):

        sms_addon = get_test_sms_addon(indx % msgs_defined)

        response = requests.post(dashboard_url, data=json.dumps(sms_addon))

        # pp.pprint(sms_addon)


main()
