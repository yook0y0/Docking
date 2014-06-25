package vo;

import java.io.Serializable;
import java.util.Date;

public class EditorReviewVO implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 5758687917002523469L;
	
	private String reviewId;
	private String editor;
	private String writer;
	private String review;
	private Integer score;
	private Date writtenDate;
	
	public String getReviewId() {
		return reviewId;
	}
	public void setReviewId(String reviewId) {
		this.reviewId = reviewId;
	}
	public String getEditor() {
		return editor;
	}
	public void setEditor(String editor) {
		this.editor = editor;
	}
	public String getWriter() {
		return writer;
	}
	public void setWriter(String writer) {
		this.writer = writer;
	}
	public String getReview() {
		return review;
	}
	public void setReview(String review) {
		this.review = review;
	}
	public Integer getScore() {
		return score;
	}
	public void setScore(Integer score) {
		this.score = score;
	}
	public Date getWrittenDate() {
		return writtenDate;
	}
	public void setWrittenDate(Date writtenDate) {
		this.writtenDate = writtenDate;
	}
	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((editor == null) ? 0 : editor.hashCode());
		result = prime * result + ((review == null) ? 0 : review.hashCode());
		result = prime * result
				+ ((reviewId == null) ? 0 : reviewId.hashCode());
		result = prime * result + score;
		result = prime * result + ((writer == null) ? 0 : writer.hashCode());
		result = prime * result
				+ ((writtenDate == null) ? 0 : writtenDate.hashCode());
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
		EditorReviewVO other = (EditorReviewVO) obj;
		if (editor == null) {
			if (other.editor != null)
				return false;
		} else if (!editor.equals(other.editor))
			return false;
		if (review == null) {
			if (other.review != null)
				return false;
		} else if (!review.equals(other.review))
			return false;
		if (reviewId == null) {
			if (other.reviewId != null)
				return false;
		} else if (!reviewId.equals(other.reviewId))
			return false;
		if (score != other.score)
			return false;
		if (writer == null) {
			if (other.writer != null)
				return false;
		} else if (!writer.equals(other.writer))
			return false;
		if (writtenDate == null) {
			if (other.writtenDate != null)
				return false;
		} else if (!writtenDate.equals(other.writtenDate))
			return false;
		return true;
	}
	@Override
	public String toString() {
		return "EditorReviewVO [reviewId=" + reviewId + ", editor=" + editor
				+ ", writer=" + writer + ", review=" + review + ", score="
				+ score + ", writtenDate=" + writtenDate + "]";
	}
	
	
}
