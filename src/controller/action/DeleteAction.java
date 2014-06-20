package controller.action;

import service.GenericService;
import serviceImpl.GenericServiceImpl;
import vo.DocumentVO;
import vo.EditorCodeVO;
import vo.EditorReviewVO;
import vo.EditorVO;
import vo.MemberContentsVO;
import vo.MemberVO;
import vo.TempVO;

public class DeleteAction {
	
	public void deleteDocument(String id){
		GenericService<DocumentVO>	s = new GenericServiceImpl<DocumentVO>();
		s.delete("document_delete", id);
	}
	
	public void deleteEditorCode(String id){
		GenericService<EditorCodeVO>	s = new GenericServiceImpl<EditorCodeVO>();
		s.delete("editorCode_delete", id);
	}

	public void deleteEditor(String id){
		GenericService<EditorVO>	s = new GenericServiceImpl<EditorVO>();
		s.delete("editor_delete", id);
	}
	
	public void deleteEditorReview(String id){
		GenericService<EditorReviewVO>	s = new GenericServiceImpl<EditorReviewVO>();
		s.delete("editorReview_delete", id);
	}

	public void deleteMember(String id){
		GenericService<MemberVO>	s = new GenericServiceImpl<MemberVO>();
		s.delete("member_delete", id);
	}

	public void deleteMemberContents(String id){
		GenericService<MemberContentsVO>	s = new GenericServiceImpl<MemberContentsVO>();
		s.delete("memberContents_delete", id);
	}

	public void deleteTemp(String id){
		GenericService<TempVO>	s = new GenericServiceImpl<TempVO>();
		s.delete("temp_delete", id);
	}
}
