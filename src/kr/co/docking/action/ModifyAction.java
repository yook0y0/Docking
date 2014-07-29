package kr.co.docking.action;

import java.util.List;

import kr.co.docking.dao.service.GenericService;
import kr.co.docking.dao.serviceImpl.GenericServiceImpl;
import kr.co.docking.vo.ContentVO;
import kr.co.docking.vo.DocumentVO;
import kr.co.docking.vo.EditorCodeVO;
import kr.co.docking.vo.EditorReviewBBSVO;
import kr.co.docking.vo.EditorVO;
import kr.co.docking.vo.MemberContentVO;
import kr.co.docking.vo.MemberVO;
import kr.co.docking.vo.TempVO;

public class ModifyAction
{
	public void documentModify(DocumentVO document) 
	{
		GenericService<DocumentVO>	genericService = new GenericServiceImpl<DocumentVO>();
		genericService.modify("document_modify", document);
	}
	
	public void contentModify(ContentVO content) 
	{
		GenericService<ContentVO>	genericService = new GenericServiceImpl<ContentVO>();
		genericService.modify("content_modify", content);
	}
	
	public void memberModify(MemberVO member) 
	{
		GenericService<MemberVO>	genericService = new GenericServiceImpl<MemberVO>();
		genericService.modify("member_modify", member);
	}
	
	public void memberContentModify(MemberContentVO memberContent) 
	{
		GenericService<MemberContentVO>	genericService = new GenericServiceImpl<MemberContentVO>();
		genericService.modify("memberContent_modify", memberContent);	
	}
	
	public void tempModify(TempVO temp)
	{
		GenericService<TempVO>	genericService = new GenericServiceImpl<TempVO>();
		genericService.modify("temp_modify", temp);	
	}
	
	public void editorModify(EditorVO editor) 
	{
		GenericService<EditorVO>	genericService = new GenericServiceImpl<EditorVO>();
		genericService.modify("editor_modify", editor);
	}
	
	public void editorCodeModify(EditorCodeVO editorCode) 
	{
		GenericService<EditorCodeVO>	genericService = new GenericServiceImpl<EditorCodeVO>();
		genericService.modify("editorCode_modify", editorCode);
	}
	
	public void editorReviewBBSModify(EditorReviewBBSVO editorReviewBBS) 
	{
		GenericService<EditorReviewBBSVO>	genericService = new GenericServiceImpl<EditorReviewBBSVO>();
		genericService.modify("editorReview_modify", editorReviewBBS);
	}
	
	public void documentModify(List<DocumentVO> document) 
	{
		GenericService<DocumentVO>	genericService = new GenericServiceImpl<DocumentVO>();
		genericService.modify("document_modify", document);
	}
	
	public void contentModify(List<ContentVO> content) 
	{
		GenericService<ContentVO>	genericService = new GenericServiceImpl<ContentVO>();
		genericService.modify("content_modify", content);
	}
	
	public void memberModify(List<MemberVO> member) 
	{
		GenericService<MemberVO>	genericService = new GenericServiceImpl<MemberVO>();
		genericService.modify("member_modify", member);
	}
	
	public void memberContentModify(List<MemberContentVO> memberContent) 
	{
		GenericService<MemberContentVO>	genericService = new GenericServiceImpl<MemberContentVO>();
		genericService.modify("memberContent_modify", memberContent);	
	}
	
	public void tempModify(List<TempVO> temp)
	{
		GenericService<TempVO>	genericService = new GenericServiceImpl<TempVO>();
		genericService.modify("temp_modify", temp);	
	}
	
	public void editorModify(List<EditorVO> editor) 
	{
		GenericService<EditorVO>	genericService = new GenericServiceImpl<EditorVO>();
		genericService.modify("editor_modify", editor);
	}
	
	public void editorCodeModify(List<EditorCodeVO> editorCode) 
	{
		GenericService<EditorCodeVO>	genericService = new GenericServiceImpl<EditorCodeVO>();
		genericService.modify("editorCode_modify", editorCode);
	}
	
	public void editorReviewBBSModify(List<EditorReviewBBSVO> editorReviewBBS) 
	{
		GenericService<EditorReviewBBSVO>	genericService = new GenericServiceImpl<EditorReviewBBSVO>();
		genericService.modify("editorReview_modify", editorReviewBBS);
	}
}
