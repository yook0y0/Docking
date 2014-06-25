package view;

public class DeveloperReview 
{
	private	String	editorName;
	private	Double	totalScore;
	private	Integer	editorType;
	
	public String getEditorName() {
		return editorName;
	}
	public void setEditorName(String editorName) {
		this.editorName = editorName;
	}
	public Double getTotalScore() {
		return totalScore;
	}
	public void setTotalScore(Double totalScore) {
		this.totalScore = totalScore;
	}
	public Integer getEditorType() {
		return editorType;
	}
	public void setEditorType(Integer editorType) {
		this.editorType = editorType;
	}
	
	@Override
	public String toString() {
		return "DeveloperReview [editorName=" + editorName + ", totalScore="
				+ totalScore + ", editorType=" + editorType + "]";
	}
}
