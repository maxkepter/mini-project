<script>
import { getAllQuestions } from '~/services/question.service';

export default {
    name: "AdminQuestionPage",
    data() {
        return {
            title: "Manage Questions",
            questions:[],
            errorMessage: "",
        };
    },methods: {
        fetchQuestions() {
            getAllQuestions().then((res)=>{
                this.questions=res;
            }).catch((err)=>{
                this.errorMessage="Failed to load questions.";
                console.error(err);
            });
        },
    },
}</script><template>
    <main>
        <b-container>
            <b-row>
                <h2>Create Question</h2>
                <b-col>
                    <b-button variant="primary" :to="{ name: 'admin-question-create' }">Create New Question</b-button>
                    </b-col>

            </b-row>
            <b-row>
                <h3>Question Added</h3>
                <div>
                    <div class="list-group">
                    <div class="list-group-item"></div>
                </div>
                </div>
            </b-row>
        </b-container>
    </main>
</template>