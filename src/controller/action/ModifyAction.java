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

public class ModifyAction {
	
	public void modifyDocument(DocumentVO vo){
		GenericService<DocumentVO>	s = new GenericServiceImpl<DocumentVO>();
		s.modify("document_modify", vo);
	}
	
	public void modifyEditorCode(EditorCodeVO vo){
		GenericService<EditorCodeVO>	s = new GenericServiceImpl<EditorCodeVO>();
		s.modify("editorCode_modify", vo);
	}

	public void modifyEditor(EditorVO vo){
		GenericService<EditorVO>	s = new GenericServiceImpl<EditorVO>();
		s.modify("editor_modify", vo);
	}
	
	public void modifyEditorReview(EditorReviewVO vo){
		GenericService<EditorReviewVO>	s = new GenericServiceImpl<EditorReviewVO>();
		s.modify("editorReview_modify", vo);
	}

	public void modifyMember(MemberVO vo){
		GenericService<MemberVO>	s = new GenericServiceImpl<MemberVO>();
		s.modify("member_modify", vo);
	}

	public void modifyMemberContents(MemberContentsVO vo){
		GenericService<MemberContentsVO>	s = new GenericServiceImpl<MemberContentsVO>();
		s.modify("memberContents_modify", vo);
	}

	public void modifyTemp(TempVO vo){
		GenericService<TempVO>	s = new GenericServiceImpl<TempVO>();
		s.modify("temp_modify", vo);
	}
}
