package org.docking.erbse.vo;

import java.io.Serializable;

public class EditorReviewBBSVO	implements Serializable 
{
	private static final long serialVersionUID = 1L;
	
	private String	reviewId;
	private	String	editorId;
	private	String	memberId;
	private	String	body;
	private	Integer	score;
	private	String	writtenDate;
	
	public String getReviewId() {
		return reviewId;
	}
	public void setReviewId(String reviewId) {
		this.reviewId = reviewId;
	}
	public String getEditorId() {
		return editorId;
	}
	public void setEditorId(String editorId) {
		this.editorId = editorId;
	}
	public String getMemberId() {
		return memberId;
	}
	public void setMemberId(String memberId) {
		this.memberId = memberId;
	}
	public String getBody() {
		return body;
	}
	public void setBody(String body) {
		this.body = body;
	}
	public Integer getScore() {
		return score;
	}
	public void setScore(Integer score) {
		this.score = score;
	}
	public String getWrittenDate() {
		return writtenDate;
	}
	public void setWrittenDate(String writtenDate) {
		this.writtenDate = writtenDate;
	}
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result
				+ ((reviewId == null) ? 0 : reviewId.hashCode());
		return result;
	}
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		EditorReviewBBSVO other = (EditorReviewBBSVO) obj;
		if (reviewId == null) {
			if (other.reviewId != null)
				return false;
		} else if (!reviewId.equals(other.reviewId))
			return false;
		return true;
	}
	@Override
	public String toString() {
		return "EditorReviewBBSVO [reviewId=" + reviewId + ", editorId="
				+ editorId + ", memberId=" + memberId + ", body=" + body
				+ ", score=" + score + ", writtenDate=" + writtenDate + "]";
	}
}
