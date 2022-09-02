import {defineStore} from "pinia";
import {QuestionService} from "../service/QuestionService";
import {SelectedOptionRequest} from "../model/request/SelectedOptionRequest";
import {NetworkErrorMessage} from "../util/messages/NetworkErrorMessage";
import {sweetToast} from "../util/mixin/sweet";


export const useCareer = defineStore('career',{
    state: ()=>({
        allQuestions: {},
        allOptions: [],
        start: true,
        end: false,
        active: [],
        nextDisabled: false,
        prevDisabled: true,
        current: 0,
        next: 0,
        prev: 0,
        AllInterest: [],
        option_id: SelectedOptionRequest.request.option_id,
        startQuestion: 0,
        evaluate: {},
        steps:{
            first: true,
            second: false,
            third: false,
            fourth: false,
        },
        isLoading: false
    }),

    actions: {
       async setAllQuestions(){
           this.isLoading = true
           try{
               const response =  await  QuestionService.allQuestion();
               if (response){
                   this.allQuestions = await response.data
                   await this.setAllOptions()
                   await this.getFetchAnswers()
               }
               this.isLoading = false
           }catch (error){
               console.log(error)
               NetworkErrorMessage(error.message)
               this.isLoading = false
           }
        },
        async setSelectedOption(payload = SelectedOptionRequest.request){
            this.isLoading = true
                try{
                    const response = await  QuestionService.selectedOption(payload)
                    if (response.status === 200){
                        this.active.push(payload.option_id)
                    }
                    this.isLoading = false
                    console.log(response)
                }catch (error){
                    // console.log(error)
                    await sweetToast.fire({
                        icon: "error",
                        text: "something went wrong might be a Network error"
                    })
                    this.isLoading = false
                }
        },
        async setAllOptions(){
            this.allOptions = await this.allQuestions.questions.map((ques)=>ques.options)
        },
        async setEvaluation(){
           try{
               const response = await  QuestionService.allEvaluation()
               console.log("evaluate")
                   this.evaluate = response.data
           }catch (error){

           }
        },
        async getFetchAnswers(){
           try{
               const response = await QuestionService.fetchAnswers();
               this.active = response.data.response_msg.map((val)=>val.id);
           }catch (e) {
               console.log(e)
           }
        },
        async getAllInterest(){
           try{
               const response = await QuestionService.allInterest();
               this.AllInterest = response.data
           }catch (e) {

           }
        }
    },

})